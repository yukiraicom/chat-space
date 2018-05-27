$(document).on('turbolinks:load', function() {
  function buildHTML(message){
var html = `              <div class='right__message clearfix' data-id="${message.id}">
                            <div class='right__message-name'>
                              ${message.name}
                            </div>
                            <div class='right__message-time'>
                              <p>２月８日(*日付表示のメソッドが動かないから)</p>
                            </div>
                            <div class='right__message-body'>
                              <p class='lower-message__content'>
                              ${message.content}
                              </p>




                            `
    if(message.image != null){
        var image = `<p class='right__body-message-image'><img src="${message.image}"></p>`;
        html += image;
        console.log(image)
        console.log("nulldayo")
    }
    html += `</div></div>`;
  return html;
  }

  function autoUp(){
    console.log("自動更新なう");
    var LastMessage = $('.right__message.clearfix').last().data("id"); //dataは文字列扱い、attrは文字列扱い？
    console.log(LastMessage);
    //datanに関してはhttp://dresscording.com/blog/html5/custom_data_attribute.html
    //に書いてある。
    $.ajax({
      type: "GET",
      url: location.href,
      data: { id: LastMessage },//idはmessages_controllerでwhereの条件に使われている。
      //dataの中身はハッシュにする。詳しくはhttps://www.buildinsider.net/web/jqueryref/059
      dataType: "json" //jbuilderはハッシュ形式で書いてある。
    })
    .done(function(messages){
      console.log("自動更新完了");
      if (messages.length !==0 ) {
        messages.forEach(function(message) {
          var html = buildHTML(message);
          $('.right__body').append(html)
          $('.right__body').animate({scrollTop: $('.right__body')[0].scrollHeight},'swing') //アニメーションは動かない
        });
      }   //controllerで定義したインスタンス変数の中身が複数になるためarray!でハッシュを配列型にする。
    })
    .fail(function(){
      alert("メッセージの取得に失敗")
    })
  }

  $(".new_message").on("submit", function(e){
    e.preventDefault();
    var formData = new FormData(this); /*formdataはフォームのデータの送信に使える。
    コントロール要素をformdaraオブジェクトにまとめる。コントロール要素とはnameやvalue属性を指す。*/
    var url = $(this).attr("action") //urlの定義。attrは指定属性を取る。今回はactionでhtmlの方にはurlが書いてある。
    console.log("非同期通信を開始した。");

    $.ajax({
      type: "POST",
      url: url,
      data: formData,//formdataもpatramsを見るとハッシュになっているから？？
      dataType: "json",
      processData: false,
      contentType: false //contentTypeはサーバーに送るデータ形式を決める。デフォルトであるxmlに上書きされるのを防ぐ。
    })
    /*jsonについて、json.nameのnameはkeyでそのあとの@message.user.nameが値となっている。 */

    .done(function(data) {
      console.log("done");
      var html = buildHTML(data);
      $('.right__body').append(html) //appendでhtmlを追加する。
      //appendの指定場所について、ulのliを追加したい場合は$('ul').append(~~~);とする。
      $('.right__footer-form').val('') /*入力したメッセージを消す。 valは要素を取得したり変更したりすることができる。
      今回の場合は入力フォームの中身をからにしている。*/
      $(".submit").prop('disabled', false)/*propは指定した属性に値をセットする。
      今回の場合はdisable属性をtrueからfalseに変えた。*/
      $('.right__body').animate({scrollTop: $('.right__body')[0].scrollHeight},'swing')//swinghs動きかたの違い
      //指定場所はappendと同じでuiないだったら$('ul').animate({scrollTop:$('.right__body')[0].scrollHeight},'swing')
      alert('非同期通信で送信が完了しました')
    }) //.doneの後に;をつけると動かない。
    .fail(function() {
      alert('メッセージが送れませんでした。')
      return false;
    })
  });

  function timer(){
    console.log("タイマーセット1");

    var currentpath = window.location.pathname;
    //windowはjavascript の最上位に位置するオブジェクト。省略可能。windwo.alert(~~~)などalert(~~~)でも可。
    //location.pathnameで現在のパスが取れる。
    if(currentpath.match(/\/groups\/\d+\/messages/)){
      autoUp();
      console.log("タイマーセット2");

    }
    else {
      console.log("現在のurlは%sだから自動更新しない。",currentpath);
    }

  }
  setInterval(timer, 5000);


});
