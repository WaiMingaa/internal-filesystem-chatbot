var dialogModel = (function(){

     dialog = [];

    function getDialog(){
      return dialog;
    }
    function _htmlToElements(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes;
    }

    function addDialog(list){
      list.forEach(function(content){
        dialog.push(content);
      })
    }

    function removeLatest(){
      dialog.pop();
    }

    function reset(){
      dialog.length=0;
    }

    function removeLastIndex(index){ // starting from 0
    if (index > -1 && dialog.length()-1-index >-1) {
        dialog.splice(dialog.length()-1-index, 1);
    }
}

return {
           getDialog: getDialog,
           addDialog: addDialog,
           removeLatest: removeLatest,
           reset: reset,
           removeLastIndex:removeLastIndex
       };

   })();
