// Fastcommerce [05/2015]


var iTimerChat=15000;
var bEnter=false;
var IsTeste=(document.location.href.toLowerCase().indexOf('mmm6')>=0);
var PageCustom="";

var zF$=(function(){

  function fnCustomizeIconsSocialNetworks(){
    var oContentHTML=document.getElementsByTagName("body")[0];
    if(oContentHTML)var aImgsShare=oContentHTML.getElementsByTagName('img');
    if(aImgsShare){
      for(var i=0;i<aImgsShare.length;i++){
        if(aImgsShare[i].className=='EstImgShareFacebook'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdFacebook.svg');
          aImgsShare[i].src=FC$.PathImg +'IconProdFacebook.svg';
          aImgsShare[i].style.width="25px";
          aImgsShare[i].style.height="25px";
        }
        else if(aImgsShare[i].className=='EstImgShareTwitter'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdTwitter.svg');
          aImgsShare[i].src=FC$.PathImg+ 'IconProdTwitter.svg';
          aImgsShare[i].style.width="25px";
          aImgsShare[i].style.height="25px";
        }
        else if(aImgsShare[i].className=='EstImgShareGooglePlus'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdGooglePlus.svg');
          aImgsShare[i].src=FC$.PathImg+ 'IconProdGooglePlus.svg';
          aImgsShare[i].style.width="25px";
          aImgsShare[i].style.height="25px";
        }
        else if(aImgsShare[i].className=='EstImgSharePinterest'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdPinterest.svg');
          aImgsShare[i].src=FC$.PathImg+ 'IconProdPinterest.svg';
          aImgsShare[i].style.width="25px";
          aImgsShare[i].style.height="25px";
        }
      }
    }
  }

  function fnFooter(){
    FCLib$.onReady(function(){
      fnCustomizeIconsSocialNetworks();
      fnShowCurrentYear();
      fnInitHomeVideoText();
    });
    if(FC$.Page=="News")fnPersonalizaNoticias();
    else if(FC$.Page=="Products")fnPersonalizaProd();
    else if(FC$.Page=="Newsletter")fnPersonalizaNewsletter();
    else if(FC$.Page=="Recommend")fnPersonalizaIndique();
  }

  function fnPersonalizaProd() {
    var oStr=document.getElementById("idFoundFC"); 
    if(!oStr)oStr=document.getElementById("idSearchNotFoundFC");
    if(oStr)oStr.innerHTML=oStr.innerHTML.replace("produto", "artigo");    
    var oTxtCatNotFound=document.getElementById("idTxtCatNotFoundFC");
    if(oTxtCatNotFound)oTxtCatNotFound.style.display="none";
    fnAdjustsFilters();
  }
  

  function fnPersonalizaNoticias(){
    document.title='Sala de imprensa :: Fastcommerce';
    var oTit=document.getElementById("idTitTextoFC");
    if(oTit)oTit.innerHTML="Sala de imprensa";
    var oTxtInitNews=document.getElementById("idTxtInitNewsFC");
    if(oTxtInitNews)oTxtInitNews.innerHTML="Relacionamos aqui as notas e press releases distribuídos aos veículos de comunicação, assim como notícias envolvendo a <a href=\"/page,arq,quemsomos\">Rumo Web</a>, seus produtos e serviços.";
  }

  function fnPersonalizaNewsletter(){
    var oTxtIntroNews=document.getElementById("idTxtIntroNewsFC");
    if(oTxtIntroNews)oTxtIntroNews.innerHTML="Fique por dentro sobre a <a href=\"/page,arq,quemsomos\">Rumo Web</a> e o <a href=\"/page,arq,recursos\">Fastcommerce</a>.<br><br>Cadastre-se aqui para receber nosso boletim periódico, que trará novidades sobre novas lojas, <a href=\"/news,idloja,1\">notícias</a> sobre o mercado B2C/B2B, dicas dos lojistas, informações sobre <a href=\"/page,arq,palestras\">palestras</a> e muito mais.";

    var oTxtAskNewsFC=document.getElementById("idTxtAskNewsFC");
    if(oTxtAskNewsFC)oTxtAskNewsFC.innerHTML="Deseja receber nosso <b>boletim periódico</b>?";

    var oTxtOptNewsYesFC=document.getElementById("idTxtOptNewsYesFC");
    if(oTxtOptNewsYesFC)oTxtOptNewsYesFC.innerHTML="Sim, desejo receber os newsletters do Fastcommerce.";
  }

  function fnPersonalizaIndique(){
    document.title='Recomende o Fastcommerce';
    var oTitTextoFC=document.getElementById("idTitTextoFC");
    if(oTitTextoFC)oTitTextoFC.innerHTML="Recomende o Fastcommerce";
    var oTxtIntroRecommendFC=document.getElementById("idTxtIntroRecommendFC");
    if(oTxtIntroRecommendFC)oTxtIntroRecommendFC.innerHTML="Gostou do <a href=\"/page,arq,recursos\">Fastcommerce</a>? Então preencha os campos abaixo para recomendar este site para um amigo.";
  }

  function fnRedefineLazyLoadSize(){
    FCLib$.LazyLoadWaitImage=FC$.PathImg+"loading.svg";
  }
     
//  fnCreateEvent("Botão","Clique","Cria loja do topo")
//  fnCreateEvent("FormContato","Erro","Nome não informado")
  function fnCreateEvent(sCategory,sAction,sLabel){
    if(typeof ga!=='undefined'){
      ga('send','event',sCategory,sAction,sLabel);
    }
  }
    
  function fnValidEmail(sEmail) {
    var regex=/^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z0-9.-]{2,4}$/;
    return regex.test(sEmail);
  }
  
  function fnIsEmpty(s){return((fnRemoveSpace(s)==null)||(fnRemoveSpace(s).length==0));}
  
  function fnRemoveSpace(theString) {
    if(theString.indexOf(" ")>=0){
      var i=0;
      while(theString.indexOf(" ")>=0){
        if(theString.charAt(i)==" ")theString=theString.substring(0,i)+theString.substring(i+1,theString.length);
        else i++;
      }
      newString=theString;
    } 
    else newString=theString;
    return newString;
  }

  function fnIntoView(oObj){
    if(oObj){
      if(!IsObjOnScreen(oObj)){
        var oPos=getPos(oObj);
        window.scrollTo(0,oPos.y-150);
      }
    }
  }

  function fnIntoViewAnim(sObjIntoView){
    jQuery(sObjIntoView).click(function(event){event.preventDefault()});
    jQuery('html,body').animate({scrollTop:jQuery(sObjIntoView).offset().top},5000);
  }

  function IsObjOnScreen(oObj){
    var oRect=oObj.getBoundingClientRect();
    return (
     oRect.top>=0 &&
     oRect.left>=0 &&
     oRect.bottom<=(window.innerHeight || document.documentElement.clientHeight) &&
     oRect.right<=(window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function fnShowCurrentYear(){
    var oYears=document.querySelectorAll(".currentYear");
    for(var i=0;i<oYears.length;i++)oYears[i].innerHTML=new Date().getFullYear();
  }

  var aFrases,oText,iCount;
  function fnInitHomeVideoText(){
    "use strict";
    oText=document.getElementById("homeVideoText");
    if(oText){
      aFrases=[
        "<h2 class='secondFrase'>Crie sua loja na plataforma</h2><h2 class='secondFrase'>de e-commerce brasileira</h2><h2 class='secondFrase'>mais escolhida do mercado.</h2><h3>Fonte: ABComm</h3>",
        "<h2>Prepare-se para crescer!</h2><h2 class='secondFrase'>Conheça o novo</h2><h2 class='secondFrase'>Fastcommerce 8.0</h2>",
        "<h2 class='secondFrase'>Migre sua loja virtual</h2><h2 class='secondFrase'>para a melhor plataforma</h2><h2 class='secondFrase'>do mercado brasileiro!</h2>",
        "<h2>Máxima performance e</h2><h2>escalabilidade automática.</h2><h2 class='secondFrase'>Mais vendas nos picos de acesso!</h2>",
        "<h2>Melhor custo x benefício.</h2><h2 class='secondFrase'>Maior lucratividade para</h2><h2 class='secondFrase'>sua loja virtual!</h2>"
      ];
      iCount=parseInt(FCLib$.GetCookie("homeVideoTextCount"));
      fnShowHomeVideoText();
    }
  }
    
  function fnShowHomeVideoText(){
    if(isNaN(iCount)||iCount>=aFrases.length)iCount=0;
    oText.innerHTML=aFrases[iCount];
    iCount++;
    FCLib$.SetCookie("homeVideoTextCount",iCount);
    $("#homeVideoText").fadeIn("slow");
    setTimeout(function(){
      $("#homeVideoText").fadeOut("slow",function(){fnShowHomeVideoText();});
    },10000);
  }

  function fnPopup(){
    if(PageCustom!="Palestras"){
      var sPopup=FCLib$.GetCookie("PopupFC");
      if(sPopup==null){zF$.fnShowPopup(true);}
    }
  }
  
  function fnClosePopup(){
    FCLib$.SetCookie("PopupFC",1);
    zF$.fnShowPopup(false);
  }
  
  function fnShowPopup(bShow){
    var oPopup=document.getElementById("FC-WebinarBox");
    if(oPopup){
      if(bShow)oPopup.style.display="block";
      else oPopup.style.display="none";
    }
  }
  
  function fnAdjustsFilters(){ 
    var bTemPathQts=false;
    var oUlPathCatQt=document.getElementById("idUlPathCatQtFC");
    if(oUlPathCatQt){bTemPathQts=true;}else{document.getElementById('idListaProdCategoriasFC').style.display="none";}
    if(!bTemPathQts)document.getElementById("idDivPath").style.display="none"; //Caso não tenha produtos em categorias/adicionais encontrados, remove div
    var oUlPathSearch=document.getElementById("idUlPathSearchFC");
    if(oUlPathSearch==null)document.getElementById("idDivSearch").style.display="none"; //Caso não tenha filtros de busca, remove div com filtros
  }
  


  return{
    fnPopup:fnPopup,
    fnClosePopup:fnClosePopup,
    fnShowPopup:fnShowPopup,
    fnCustomizeIconsSocialNetworks:fnCustomizeIconsSocialNetworks,
    fnIntoViewAnim:fnIntoViewAnim,
    fnShowCurrentYear:fnShowCurrentYear,
    fnValidEmail:fnValidEmail,
    fnIsEmpty:fnIsEmpty,
    fnRemoveSpace:fnRemoveSpace,
    fnCreateEvent:fnCreateEvent,
    fnRedefineLazyLoadSize:fnRedefineLazyLoadSize,
    fnAdjustsFilters:fnAdjustsFilters,
    fnFooter:fnFooter
  }
})();

zF$.fnRedefineLazyLoadSize();

//Enter / Form
document.addEventListener("keydown",logPressedKeys,false);

function logPressedKeys(e) {
  if(e.keyCode==13){
    bEnter=true;
    return false;
  }
}

