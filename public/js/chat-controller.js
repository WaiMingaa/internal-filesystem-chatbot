//var socket = io();
var chatapp = angular.module('chatApp', ['ngFileUpload', 'ngSanitize']);
chatapp.controller('ChatController', function ($scope, $parse, GencaseService, $compile, $http, $sce, LangHandler, MessageBuilder, PipelineService, MessageConnector, TimeHandler, ConversationHandler, Upload, $q) {
    /*********init soundRecorder*********/
    soundRecorder.init(function (rate) {
        $scope.rate = rate;
    }, function (media) {
        $scope.media = !!media;
    });


    /*******Dialog Model************/
    var _dialog = dialogModel;
    $scope.conversation = _dialog.getDialog();
    $scope.showRecording = true;
    PipelineService.setVoice(false);
    /*************onready funciton*************/
    angular.element(document).ready(function () {
        MessageConnector.sendNormalRequest('');
        $scope.input = '';
        $scope.voiceswitch = false;
    });


    $scope.play = function () {
        $scope.voiceswitch = true;
        PipelineService.setVoice($scope.voiceswitch);
        $('.ui.modal').modal('hide');
    };

    $scope.mute = function () {
        $scope.voiceswitch = false;
        PipelineService.setVoice($scope.voiceswitch);
        $('.ui.modal').modal('hide');
    };
    /******** function associated with send button*******/
    $scope.enterSend = function (event) {
        if (event.keyCode == 13)
            $scope.send();
    };
    var _resetinput = function () {
        $scope.input = '';
    };
    $scope.send = function () {
        var _input = $scope.input;
        MessageConnector.sendNormalRequest(_input);
        _resetinput();
    };

    /***** function associated with refresh button *****/
    $scope.reset = function () {
        _dialog.reset();
        ConversationHandler.reset();
        MessageConnector.sendNormalRequest('');
        $('.ui.modal').modal('hide');
    };

    /****** function associated with service button ******/
    $scope.add = function () {
        $("#file").click();
    };
    $scope.upload = function (file) {
        if (file && !file.$error) {
            $scope.f = file;
            Upload.dataUrl($scope.f, true).then(function (url) {
                var imgtag = '<img src="' + url + '" height="100" width="100">'
                MessageBuilder.build(PipelineService.buildUserJSON(imgtag)).then(function (dialog) {
                    _dialog.addDialog(dialog);
                })
            });
            console.log(imageRecongnition.getUrl());
            var uploadurl = '/upload/default';
            Upload.upload({
                url: imageRecongnition.getUrl(),
                data: {
                    file: $scope.f
                }
            }).then(function (resp) {
                len = resp.data.images[0].classifiers.length;
                if (len > 0) {
                    c = "";
                    score = 0;
                    resp.data.images[0].classifiers[0].classes.forEach(function (r) {
                        tempscore = r.score;
                        if (tempscore > 0.5 && tempscore > score) {
                            score = tempscore;
                            c = r.class
                        }
                    });
                } else {
                    score = 0;
                    c = 0;
                }
                if (score > 0.5) {
                    MessageConnector.getResponse(c);
                }
            })
        }
    };

    /**function associated with voice button **/
    $scope.startRecord = function () {
        soundRecorder.startRecording();
        $scope.showRecording = false;
        setTimeout(function () {
            if (!$scope.showRecording)
                $('.stop_voice').click();
        }, 10000);

        $scope.stopRecord = function () {
            soundRecorder.stopRecording(_sendvoice);
            $scope.showRecording = true;
            $('.send_message').prop('disabled', false);
        }
    };
    var _sendvoice = function (blob, text) {
        var form = new FormData();
        $http({
            method: 'POST',
            url: '/api/speechtotext',
            data: {
                'blob': blob,
                'lang': LangHandler.getlang(),
                'rate': $scope.rate
            },
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            if (response.data.text == '') {
                MessageBuilder.build(PipelineService.buildUserJSON("******")).then(function (dialog) {
                    _dialog.addDialog(dialog);
                });
                MessageBuilder.build(PipelineService.buildBotJSON(new Promise(function () {
                    return "聽唔清楚請你講多次/Please repeat"
                }))).then(function (dialog) {
                    _dialog.addDialog(dialog);
                });
                return;
            } else {
                var speech = response.data.text
                MessageConnector.sendNormalRequest(speech);
            }
        }, function errorCallback(response) {
        });
    };

// for render html
    $scope.trustAsHtml = function (string) {
        return $sce.trustAsHtml(string);
    };

    $scope.setting = function () {
        $('.popup').popup();
        $('.ui.modal')
            .modal('show')
        ;
    };


    $scope.back = function () {
        $('.ui.modal')
            .modal('hide')
    };
    sendByButton = function (text) {
        _dialog.removeLatest();
        MessageConnector.sendNormalRequest(text);
    };
    //
    // flipleft=  function (){
    //   $('.shape').shape();
    //     $('.shape').shape('flip left');
    //   }
    //   flipright=  function ($watch){
    //     $('.shape').shape();
    //       $('.shape').shape('flip right');
    //     }

    submitform = function (...l
)
    {
        var promise = function (){
            var deferred = $q.defer();
            var list = [...l
        ]
            ;
            var title = list[0];
            var vlist = [];
            list = list.slice(1, list.length);
            list.forEach(function (i) {
                var the_string = i.id;
                var the_value = i.value;
                /* var model = $parse(the_string);
                 var v= model.assign($scope, i.value);*/
                vlist.push({id: the_string, value: the_value});

            });
            deferred.resolve({'title':title,'list':vlist});
            return deferred.promise;
        };
        /* sendByButton('表格已經傳送');
         MessageBuilder.build(PipelineService.buildBotJSON(new Promise(function () {
             return "多謝你的資料，我們將儘快處理。"
         }))).then(function (dialog) {
             _dialog.addDialog(dialog);
         });
 */
        promise().then(function(data){
            console.log(data);
        $http({
            method: 'POST',
            url: '/form',
            data:data,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            sendByButton('表格已經傳送');
            MessageBuilder.build(PipelineService.buildBotJSON(new Promise(function () {
                return "多謝你的資料，我們將儘快處理。"
            }))).then(function (dialog) {
                _dialog.addDialog(dialog);
            });
        })
        })
    }

});


chatapp.service('TimeHandler', function () {
    var TimeHandler = {};
    paddingZero = function (int, str) {
        s = String(str)
        while (s.length < int) {
            s = "0" + str;
        }
        return s;
    };
    TimeHandler.getCurrentTime = function () {
        var currentdate = new Date();
        return currentdate.getHours() + ":" + paddingZero(2, currentdate.getMinutes());
    };
    return TimeHandler;
});

chatapp.service('MessageBuilder', function (TimeHandler, $q) {
    this.build = function (p) {
        var deferred = $q.defer();
        var _genUserMessage = this.genUserMessage;
        var _genBotMessage = this.genBotMessage;
        var dialog = [];

        p.then(function (jlist) {
            jlist.forEach(function (json) {
                var data = json;
                if (data.side == 'user') {
                    dialog.push(_genUserMessage(data.content));
                } else {
                    dialog.push(_genBotMessage(data.content));
                }
            });
            deferred.resolve(dialog)
        });
        return deferred.promise;
    };

    this.genBotMessage = function (word) {
        return '<div class="row"> <div class="col-md-7"><li class=\"self-left\"><img style="width:70x;height:50px;" src="./img/chaticon.png" aria-hidden="true"></img><div class="bubble-left">' + '<p align=\"left\"><div class="ui fluid segment">' + word + '</div></p></div><span class="timetext-left">' +
            TimeHandler.getCurrentTime() + '</span></li></div></div>';
    };

    this.genUserMessage = function (word) {
        return '<div class="row"> <div class="col-md-7 col-md-offset-5"><li class=\"self-right\"><span class="timetext-right">' +
            TimeHandler.getCurrentTime() + '</span><div class="bubble-right"><div class="ui fluid segment" style=max-width:280px;">' + word + '</div></div><img style="width:70x;height:50px;" src="./img/usericon.png" aria-hidden="true"></img></li></div></div>';
    }
});

chatapp.service('PipelineService', function ($q, ConversationHandler) {
    var _voiceswitch;
    this.setVoice = function (bool) {
        _voiceswitch = bool;
    };
    this.buildUserJSON = function (text) {
        var deferred = $q.defer();
        var jlist = [];
        var json = {
            side: 'user',
            content: text

        };
        jlist.push(json);
        deferred.resolve(jlist);
        return deferred.promise;
    };

    this.buildUserEvent = function (event) {
        return templateObject.getTemplate(event);
    };

    this.buildBotJSON = function (promise) {
        var _getBotJson = function (text) {
            var json = {
                side: 'bot',
                content: text
            };
            return json;
        };
        var _getUserJson = function (text) {
            var json = {
                side: 'user',
                content: text
            };
            return json;
        };
        var _buildEvent = this.buildUserEvent;
        var deferred = $q.defer();
        var jlist = [];
        promise.then(function (response) {
            ConversationHandler.setResponseParam(response);
            response.data.output.text.forEach(function (text) {
                if (_voiceswitch)
                    responsiveVoice.speak(text, 'Chinese (Hong Kong) Female');
                jlist.push(_getBotJson(text));
            });
            if (response.data.context.event) {
                response.data.context.event.forEach(function (e) {
                    if (e.side == "user")
                        jlist.push(_getUserJson(_buildEvent(e)));
                    else
                        jlist.push(_getBotJson(_buildEvent(e)));
                })

            }
            deferred.resolve(jlist);
        });
        return deferred.promise;
    }
});

chatapp.service('MessageConnector',
    function (ConversationHandler, MessageBuilder, PipelineService, LangHandler, $http) {
        var langcode = LangHandler.getlang();

        this.getResponse = function (text) {
            ConversationHandler.setRequestParam(text);
            var result = $http({
                method: 'POST',
                url: (langcode == "en-US") ? '/api/message' : (langcode == "cmn-Hans-HK") ? '/api/message/mandarin' : '/api/message/chi',
                data: ConversationHandler.getRequestParam(),
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            var promise = MessageBuilder.build(PipelineService.buildBotJSON(result));
            promise.then(function (dialog) {
                dialogModel.addDialog(dialog);
            })
        };
        this.sendNormalRequest = function (text) {
            ConversationHandler.setRequestParam(text);
            if (!text == '') {
                var reqpromise = MessageBuilder.build(PipelineService.buildUserJSON(text));
                reqpromise.then(function (dialog) {
                    dialogModel.addDialog(dialog);
                })
            }
            var result = $http({
                method: 'POST',
                url: (langcode == "en-US") ? '/api/message' : (langcode == "cmn-Hans-HK") ? '/api/message/mandarin' : '/api/message/chi',
                data: ConversationHandler.getRequestParam(),
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            var respromise = MessageBuilder.build(PipelineService.buildBotJSON(result));
            respromise.then(function (dialog) {
                dialogModel.addDialog(dialog);
            })
        }
    });
chatapp.service('LangHandler', function () {

    this.langcode = 'yue-Hant-HK';
    this.getlang = function () {
        return this.langcode;
    };
    this.setlang = function (lang) {
        switch (lang) {
            case 'CAN':
                this.langcode = 'yue-Hant-HK';
                break;
            case 'ENG':
                this.langcode = 'en-US';
                break;
            case 'MAN':
                this.langcode = 'cmn-Hans-HK'
                break;
            default:
                this.langcode = 'yue-Hant-HK';
        }
    }
});
chatapp.service('ConversationHandler', function () {
    this.reqpayload = {
        context: {},
        input: {
            text: ''
        }
    };
    this.respayload = {
        context: {},
        output: {}
    };
    this.getNewReqPayload = function () {

        return {
            context: {},
            input: {}
        };
    };
    //set text
    this.setRequestParam = function (textstring) {
        if (!textstring == '') {
            reqpayload = this.getNewReqPayload();
            reqpayload.input = {
                text: textstring
            };
            this.reqpayload = reqpayload;
        } else {
            this.reqpayload = this.getNewReqPayload();
        }

    };
    //add response context to request
    this.getRequestParam = function () {
        this.reqpayload.context = this.getResponseParam().context;
        //earse context.event
        this.eraseEvent(this.reqpayload);
        return this.reqpayload;
    };
    this.setResponseParam = function (res) {
        payload = this.getResponseParam();
        payload.context = res.data.context;
        payload.output = res.data.output;
    };
    this.getResponseParam = function () {
        return this.respayload;
    };
    this.reset = function () {
        this.respayload = {
            context: {},
            output: {}
        };
        this.reqpayload = this.getNewReqPayload();
    };
    this.eraseEvent = function (req) {
        req.context.event = ""
    }
});
chatapp.service('UrlHandler', function ($http, $q) {
    this.checkcontainurl = function (stri) {
        const regex = /[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
        var stri = stri;
        let m;
        if ((m = regex.exec(stri)) !== null) {
            // The result can be accessed through the `m`-variable.
            return m[0];
        } else {
            return false;
        }
    };
    this.genthumbnail = function (url) {
        var deferred = $q.defer();
        booleanurl = this.checkcontainurl(url);
        if (!booleanurl) {
            deferred.resolve(url)
        } else {
            booleanurl = 'http://' + booleanurl;
            return $http({
                method: 'GET',
                url: '/geturl?url=' + encodeURI(booleanurl),
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
        }
        return deferred.promise;
    }
});

chatapp.service('GencaseService', function ($http) {
    this.gencase = function (data) {
        return $http({
            method: 'POST',
            url: '/gencase',
            data: data,
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
    }
});
chatapp.directive('uploadfile', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.bind('click', function (e) {
                $('#file').click();
            });
        }
    };
});

chatapp.directive('bindUnsafeHtml', ['$compile', 'MessageConnector', function ($compile, MessageConnector) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'bindUnsafeHtml' expression for changes
                return scope.$eval(attrs.bindUnsafeHtml);
            },
            function (value) {
                // when the 'bindUnsafeHtml' expression changes
                // assign it into the current DOM
                element.html(value);
                // compile the new DOM and link it to the current
                // scope..
                new bindhandler();
                $("#displaymessage").scrollTop($("#displaymessage")[0].scrollHeight);
                $('.ui.rating').rating('setting', 'onRate', function (value) {
                    $('.ui.rating').rating('disable')
                    $("#sendbutt").click();
                });
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);
