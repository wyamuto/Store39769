// Template FastCommerce [11/2014]

var iQtdProds=0;
var iItensCesta=0;
ImgLoadingFC=FC$.PathImg+"loading.gif";
ImgOnError=FC$.PathImg+"nd";

var sF$=(function(){

  var sCurrentPage=document.location.href.toUpperCase();

  function fnGetID(id){
    return document.getElementById(id);
  }

  //Fun��o que faz pr�-load das imagens
  function fnPreloadImages() { //v3.0
    var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=fnPreloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
  }

  //Fun��o para mostrar valor economizado em produtos em promo��o
  function fnShowEconomy(ProdPrice,ProdPriceOri){
    if(ProdPrice!=ProdPriceOri)document.write("<font style='font-size:16px;display:block;margin:10px 0;' color=#6f9e45>Economize <b>"+FormatPrice(ProdPriceOri-ProdPrice,'R$')+"</b> ("+fnFormatNumber(((ProdPriceOri-ProdPrice)/ProdPriceOri)*100)+"%)</font>");
  }
  
  function fnFormatNumber(num){
    num=num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))num="0";
    sign=(num==(num=Math.abs(num)));
    num=Math.floor(num*100+0.50000000001);
    num=Math.floor(num/100).toString();
    for(var i=0;i<Math.floor((num.length-(1+i))/3);i++)num=num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
    return ((sign)?'':'-')+num;
  }
  
  function fnLogout(){
    if(FC$.ClientID!=0){
      var oLinkLogin=fnGetID("idLinkLoginFC");
      if(oLinkLogin){
        oLinkLogin.innerHTML="Logout";
        oLinkLogin.href="cadastro.asp?idloja="+ FC$.IDLoja +"&logoff=true";
      }
    }
  }

  var iPL=0;
  
  function fnShowPrice(Price,OriginalPrice,Cod,iMaxParcels,ProductID){
    iPL++;
    //console.log(ProductID+ " iPL="+ iPL +" Price="+Price +" OriginalPrice="+ OriginalPrice +" Cod="+ Cod);
    var idPrice=fnGetID("idProdPrice"+ProductID);
    var sPrice="";
    if(Price==0 && OriginalPrice==0){
      if(idPrice)idPrice.innerHTML="<div class=\"prices\"><br><div class=price><div class=currency><a href=/faleconosco.asp?idloja="+FC$.IDLoja+"&assunto=Consulta%20sobre%20produto%20(C�digo%20"+Cod+")>Consulte-nos</a></div></div></div>";
      return void(0);
    }
    var iPrice=Price.toString().split(".");
    if(iPrice.length==2){
      var iPriceInt=iPrice[0];
      var PriceDecimal=iPrice[1];
      if(PriceDecimal.length==1)PriceDecimal+="0";
    }
    else{
      var iPriceInt=iPrice;
      var PriceDecimal="00";
    }    

    var sInterest;

    if(typeof Juros!="undefined"){
      if(iMaxParcels==0||iMaxParcels>Juros.length)iMaxParcels=Juros.length;
      if(Juros[iMaxParcels-1]>0)sInterest=""; else sInterest=" sem juros";
    }
    else{
      iMaxParcels=0;
    }

    if(Price!=OriginalPrice){
      sPrice+="<div class=\"prices\">";
      sPrice+="  <div class=\"old-price\">De&nbsp; <span>"+FormatPrice(OriginalPrice,'R$')+"</span><div class=\"por\">Por</div></div>";
      sPrice+="  <div class=\"price\"><span class=\"currency\"><strong>R$ </span><span class=\"int\">"+ fnFormatNumber(iPriceInt) +"</span><span class=\"dec\">,"+ PriceDecimal +"</span></strong></div>";
      if(iMaxParcels>1)sPrice+="  <div class=\"installments\"><strong><span class=\"installment-count\">"+ iMaxParcels +"</span>x</strong> de <strong><span class=\"installment-price\">"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span></strong>"+ sInterest +"</div>";
      sPrice+="</div>";
    }
    else{
      sPrice+="<div class=\"prices\">";
      sPrice+="  <div class=\"old-price\"><span>&nbsp;</span><div class=\"por\">Por</div></div>";
      sPrice+="  <div class=\"price\"><span class=\"currency\"><strong>R$ </span><span class=\"int\">"+ fnFormatNumber(iPriceInt) +"</span><span class=\"dec\">,"+ PriceDecimal +"</span></strong></div>";
      if(iMaxParcels>1)sPrice+="  <div class=\"installments\"><strong><span class=\"installment-count\">"+ iMaxParcels +"</span>x</strong> de <strong><span class=\"installment-price\">"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span></strong>"+ sInterest +"</div>";
      sPrice+="</div>";
    }

    if(idPrice)idPrice.innerHTML=sPrice;

  }

  function fnShowParcels(Price,iMaxParcels,ProductID){
    var idParcelsProd=fnGetID("idProdParcels"+ProductID);
    var sPrice="";
    var sInterest;
    if(typeof Juros!="undefined"){
      if(iMaxParcels==0||iMaxParcels>Juros.length)iMaxParcels=Juros.length;
      if(Juros[iMaxParcels-1]>0)sInterest=""; else sInterest=" sem juros";
    }
    else{
      iMaxParcels=0;
    }
    if(iMaxParcels>1)sPrice+="<div class=\"installments\">ou <strong><span class=\"installment-count\">"+ iMaxParcels +"</span>x</strong> de <strong><span class=\"installment-price\">"+FormatPrecoReais(CalculaParcelaJurosCompostos(Price,iMaxParcels))+"</span></strong>"+ sInterest +"</div>";
    if(idParcelsProd)idParcelsProd.innerHTML=sPrice;
  }

  function fnShowButtonCart(Estoque, IDProd){
    var idButton=document.querySelector('#idButtonProd'+IDProd+' img');
    var idAviso=document.querySelector('#idAvisoProd'+IDProd+'');
    var avisoDisp='<span class="mntext"><a href="#na" onclick="sF$.fnShowDisp('+IDProd+');" title="Clique aqui para ser avisado da disponibilidade deste produto">Avise-me</a> quando estiver dispon�vel.</span>';

    if (idButton){
      if(Estoque==0){
        idButton.setAttribute('src',''+FC$.PathImg+'BotCarrinhoEsgotado.svg');
        idAviso.innerHTML=avisoDisp;
      }else{
        idButton.setAttribute('src',''+FC$.PathImg+'BotCarrinho.svg');
      }
    } 
  }

  function fnShowDisp(IDProd){
    popup=window.open("AvisaDispProduto.asp?IDLoja="+ FC$.IDLoja +"&IDProduto="+ IDProd,"Disp","top=10,left=10,height=480,width=450,scrollbars=yes");
    popup.focus();
    return void(0);
  }

  function fnSearchSubmit(oForm){
    var oSearch=oForm.Texto;
    if(oSearch){
      var sSearch=oSearch.value;
      if(sSearch.length<2){
        alert("Preencha a busca corretamente");
        oSearch.focus();
       }
       else{
        document.TopSearchForm.submit()
       }
    }
  }
  
  function fnSearchToolbarSubmit(oForm){
    var oSearch=oForm.Texto;
    if(oSearch){
      var sSearch=oSearch.value;
      if(sSearch.length<2){
        alert("Preencha a busca corretamente");
        oSearch.focus();
       }
       else{
        document.TopSearchToolbarForm.submit()
       }
    }
  }

  function fnCustomizeIconsSocialNetworks(isProd){
  //se isProd personaliza �cones do detalhe do produto, caso contr�rio do rodap�
    if(isProd)var oContentHTML=document.getElementById("idShareProd");
    else var oContentHTML=document.getElementById("idShareFooter");
    if(oContentHTML)var aImgsShare=oContentHTML.getElementsByTagName('img');
    if(aImgsShare)
      for(var i=0;i<aImgsShare.length;i++){
        if(aImgsShare[i].className=='EstImgShareFacebook'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdFacebook.svg');
          aImgsShare[i].src=FC$.PathImg +'IconProdFacebook.svg';
        }
        else if(aImgsShare[i].className=='EstImgShareTwitter'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdTwitter.svg');
          aImgsShare[i].src=FC$.PathImg+ 'IconProdTwitter.svg';
        }
        else if(aImgsShare[i].className=='EstImgShareGooglePlus'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdGooglePlus.svg');
          aImgsShare[i].src=FC$.PathImg+ 'IconProdGooglePlus.svg';
        }
        else if(aImgsShare[i].className=='EstImgSharePinterest'){
          aImgsShare[i].setAttribute('data-src',FC$.PathImg +'IconProdPinterest.svg');
          aImgsShare[i].src=FC$.PathImg+ 'IconProdPinterest.svg';
        }
        if(isProd){ //produto
          aImgsShare[i].style.width="25px";
          aImgsShare[i].style.height="25px";
        }
        else{ //rodap�
          aImgsShare[i].style.width="20px";
          aImgsShare[i].style.height="20px";
        }
    }
  }
 
  function fnShowCart(bShow,ItensCesta){
   oTabItensCart=document.getElementById('TabItensCart');
   if(bShow){
      oTabItensCart.className="EstTabItensCartOn";
      document.getElementById('DivItensCart').style.display="";
    }
   else{
      oTabItensCart.className="EstTabItensCart";
      document.getElementById('DivItensCart').style.display="none";
    }
  }
  
  function fnGoCart(){
    document.location.href="addproduto.asp?idloja="+FC$.IDLoja;
  }

  function fnUpdateCart(IsAdd,IsSpy){
    if (window.XMLHttpRequest){var oXMLHTTP=new XMLHttpRequest();}
    else{var oXMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");}
    oXMLHTTP.open("GET","XMLCart.asp?IDLoja="+FC$.IDLoja+"",false);
    oXMLHTTP.send();
    oXMLDoc=oXMLHTTP.responseXML; 
    var oCarts=oXMLDoc.getElementsByTagName("cart");
    try{currencyProdCart=(oCarts[0].getElementsByTagName("currency")[0].childNodes[0].nodeValue);}catch(e){currencyProdCart="R$"}
    try{TotalQtyProdCart=(oCarts[0].getElementsByTagName("TotalQty")[0].childNodes[0].nodeValue);}catch(e){TotalQtyProdCart="0"}
    try{subtotalProdCart=(oCarts[0].getElementsByTagName("subtotal")[0].childNodes[0].nodeValue);}catch(e){subtotalProdCart="0,00"}
    iItensCesta=TotalQtyProdCart;
    if(IsSpy){
      var oReferrer=window.parent;
      try{oReferrer.document.getElementById("idCartItemsTop").innerHTML=iItensCesta;}catch(e){}
      try{oReferrer.document.getElementById("idCartItemsToolTop").innerHTML=iItensCesta;}catch(e){}
      try{oReferrer.document.getElementById("idCartTotalTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
      try{oReferrer.document.getElementById("idCartTotalToolTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
    }else{
      try{document.getElementById("idCartItemsTop").innerHTML=iItensCesta;}catch(e){}
      try{document.getElementById("idCartItemsToolTop").innerHTML=iItensCesta;}catch(e){}
      try{document.getElementById("idCartTotalTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
      try{document.getElementById("idCartTotalToolTop").innerHTML=FCLib$.FormatPreco(currencyProdCart +" "+ subtotalProdCart);}catch(e){}
    }
  }  
    

  //Hist�rico de navega��o
  
  function fnLoadXMLPageHistory(){
    if (window.XMLHttpRequest){var oXMLHTTP=new XMLHttpRequest();}
    else {var oXMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");}
    oXMLHTTP.open("GET","xmlpagehistory.asp?idloja="+FC$.IDLoja,false);
    oXMLHTTP.send();
    var oXMLDoc=oXMLHTTP.responseXML; 
    return(oXMLDoc.getElementsByTagName("item"));
  }
  
  function fnShowPageHistory(oHistoryPages){
    var oPageHistory=document.getElementById("idPageHistory");
    if(oPageHistory){
      var sPageHistory="";
      try{var sBar=(oHistoryPages[0].getElementsByTagName("title")[0].childNodes[0].nodeValue);}
      catch(e){var sBar="";}
      if(sBar!=""){sPageHistory+="<div class='FooterSepFC col-xlarge-12'></div><div id='idDivPageHistory'><div id='idPageHistoryFC'><div id='idTitPageHistory'>P�ginas Visitadas:</div><ul id='idListPageHistoryFC'>";}  
      for (i=0;i<oHistoryPages.length;i++){
        sTitleProd=oHistoryPages[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        sLinkProd=oHistoryPages[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
        try{sImageProd=oHistoryPages[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;}
        catch(e){sImageProd=FC$.PathImg+"nd0.gif";}
        try{sPriceProd=(oHistoryPages[i].getElementsByTagName("price")[0].childNodes[0].nodeValue);}
        catch(e){sPriceProd="";}
        sTitleProd=sTitleProd.substring(0,20);
        sPageHistory+="<li>";
        sPageHistory+="";
        sPageHistory+="<div class='xEstNamePageHistory'><a href='"+ sLinkProd +"'>"+ sTitleProd + "..."+"</a></div>";
        sPageHistory+="<div class=EstPricePageHistory>"+ sPriceProd +"</div>";
        sPageHistory+="</li>";
      }
      oPageHistory.innerHTML=sPageHistory+"</ul></div></div>";
    }
  }

  function fnInsertVideo(ProductID,CodVideo){
    var oVideo=document.getElementById("VideoProd"+ProductID);
    if(oVideo){
      oVideo.innerHTML="<iframe class=\"VideoProd\" src=\"//www.youtube.com/embed/"+ CodVideo +"?controls=1&showinfo=0&rel=0&modestbranding=1&theme=light&modestbranding=1\" frameborder=0 allowfullscreen></iframe>"
    }
  }
  
  function fnAdjustsFilters(){ 
    var bTemPathQts=false;
    var oUlPathCatQt=document.getElementById("idUlPathCatQtFC");
    if(oUlPathCatQt){bTemPathQts=true;}else{document.getElementById('idListaProdCategoriasFC').style.display='none';}
    var oUlAdic1Qt=document.getElementById("idUlAdic1QtFC");
    if(oUlAdic1Qt){bTemPathQts=true;}else{document.getElementById('idListaProdAdicional1FC').style.display='none';}
    var oUlAdic2Qt=document.getElementById("idUlAdic2QtFC");
    if(oUlAdic2Qt){bTemPathQts=true;}else{document.getElementById('idListaProdAdicional2FC').style.display='none';}
    var oUlAdic3Qt=document.getElementById("idUlAdic3QtFC");
    if(oUlAdic3Qt){bTemPathQts=true;}else{document.getElementById('idListaProdAdicional3FC').style.display='none';}
    //Caso n�o tenha produtos em categorias/adicionais encontrados, remove div
    if(!bTemPathQts)document.getElementById("idDivPath").style.display='none';
    //Caso n�o tenha filtros de busca, remove div com filtros
    var oUlPathSearch=document.getElementById("idUlPathSearchFC");
    if(oUlPathSearch==null)document.getElementById("idDivSearch").style.display='none';
  }

  function fnCopyContentTop(){
    var oBannerTop=document.querySelector(".bannerModel");
    if(oBannerTop){
      var oBannerTopHome=document.getElementById("idBannerImgFC");
      if(oBannerTopHome)oBannerTop.innerHTML=oBannerTopHome.innerHTML;
      oBannerTopHome.innerHTML="";
    }
  }

  return{
    sCurrentPage:sCurrentPage,
    fnGetID:fnGetID,
    fnCustomizeIconsSocialNetworks:fnCustomizeIconsSocialNetworks,
    fnPreloadImages:fnPreloadImages,
    fnShowEconomy:fnShowEconomy,
    fnLogout:fnLogout,
    fnShowPrice:fnShowPrice,
    fnShowParcels:fnShowParcels,
    fnShowButtonCart:fnShowButtonCart,
    fnShowDisp:fnShowDisp,
    fnSearchSubmit:fnSearchSubmit,
    fnSearchToolbarSubmit:fnSearchToolbarSubmit,
    fnFormatNumber:fnFormatNumber,
    fnShowCart:fnShowCart,
    fnGoCart:fnGoCart,
    fnUpdateCart:fnUpdateCart,
    fnLoadXMLPageHistory:fnLoadXMLPageHistory,
    fnShowPageHistory:fnShowPageHistory,
    fnInsertVideo:fnInsertVideo,
    fnAdjustsFilters:fnAdjustsFilters,
    fnCopyContentTop:fnCopyContentTop
  }

})();

//Fun��es para o carrinho

var oDivShowCartOnPage=null;
var iLastCartOnPage=0;

function ShowCartOnPage(IDLoja,iErr,sMsg,sCartText,sCheckoutText,este){
  //console.log('function ShowCartOnPage de LojaLib.js #####');
  var oPos=getPos(este);
  if(oDivShowCartOnPage==null){
    var oNewElement=document.createElement("div");
    oNewElement.setAttribute("id","DivShowCartOnPage"); 
    oDivShowCartOnPage=este.parentNode.insertBefore(oNewElement,este);
  }
  oDivShowCartOnPage.style.backgroundColor="#fcfcfc";
  oDivShowCartOnPage.style.borderColor="#cdcdcd";
  oDivShowCartOnPage.style.color="#555555";
  oDivShowCartOnPage.style.border="1px solid #cdcdcd";
  oDivShowCartOnPage.style.marginTop="-135px";
  oDivShowCartOnPage.style.marginLeft="0px";
  oDivShowCartOnPage.style.position="absolute";
  oDivShowCartOnPage.style.zIndex="1";
  var iW=238;
  var iH=100;
  var oPosPrice=document.getElementById('PosPrice');
  if(oPosPrice){
    iW=oPosPrice.offsetWidth;
    iH=oPosPrice.offsetHeight;
  }
  if(iErr==0)sBackColor="3187e6"; else sBackColor="949494"
  var sHTML="<table id=idTabShowCartOnPageFC width='"+iW +"' height='"+ iH +"' cellpadding=3 cellspacing=3>";
     sHTML+="<tr onclick=window.location.href='addproduto.asp?idloja="+ IDLoja +"'><td id=idTDTitShowCartOnPageFC colspan=2 align=center style='background-color:#"+ sBackColor +";color:#ffffff;border-width:1px;border-color:#3b6e22;font-weight:bold;font-size:12px;cursor:pointer'><div style='padding:5px; line-height:45px;'>"+ sMsg +"</div></td></tr>";
     if(iErr==0){
       sHTML+="<tr height=45>";
       sHTML+="<td valign=top align=center style=cursor:pointer onclick=window.location.href='addproduto.asp?idloja="+ IDLoja +"'><a href='addproduto.asp?idloja="+ IDLoja +"' style='color:#444444;text-decoration:none;font-size:14px;font-weight:bold;'>Ir para o carrinho</a></td>";
       sHTML+="<td align=left><img src='"+ FC$.PathImg +"IconClose.svg' width=20 height=20 hspace=5 style='cursor:pointer;margin-top:10px' onclick=oDivShowCartOnPage.style.visibility='hidden'></td>";
       sHTML+="</tr>";
       sF$.fnUpdateCart(true,false);
     }
     else{
       sHTML+="<tr height=20>";
       sHTML+="<td colspan=2 align=center><img src='"+ FC$.PathImg +"close.svg' width=20 height=20 hspace=5 style='cursor:pointer' onclick=oDivShowCartOnPage.style.visibility='hidden'></td>";
       sHTML+="</tr>";
     }
     sHTML+="</table>";
  oDivShowCartOnPage.style.top=oPos.y+"px";
  oDivShowCartOnPage.style.left=oPos.x+"px";
  oDivShowCartOnPage.innerHTML=sHTML;
  oDivShowCartOnPage.style.visibility="visible";
  iLastCartOnPage++;
  setTimeout("if(iLastCartOnPage=="+ iLastCartOnPage +")oDivShowCartOnPage.style.visibility='hidden';",4000);
}

// ZipCode - CEP
function fnShowCEP(IDProd){
  if(FC$.TypeFrt==3){
    var sNumCEP=fnGetCookie('CEP'+FC$.IDLoja);
    if(sNumCEP==null)sNumCEP="";
    sCEP="<div id='idDivCEPFC'>";
    sCEP+="  <div id='idDivTitCEP'><img src='"+ FC$.PathImg +"IconZipTruck.svg' width='25' height='25' alt='Zip box' /><span>Simule o valor do frete</span></div>";
    sCEP+="  <div id='idDivContentCEP'>";
    sCEP+="    <div id='idDivContentFieldsCEP'>";
    sCEP+="      <div id='idDivCEPCalc'>";
    sCEP+="        <div class='FieldCEP FieldCEPQty'><label>Qtd.</label><input type='number' id='idQtdZip"+ IDProd +"' value='1' maxlength='4'></div>";
    sCEP+="        <div class='FieldCEP FieldCEPNum'><input type='text' placeholder='CEP' id='idZip"+ IDProd +"' value='"+ sNumCEP +"' maxlength='9'></div>";
    sCEP+="        <img src='"+ FC$.PathImg +"IconNewsletter.svg' height='29px' id='idCEPButton' class='FieldCEPBtn' onclick='fnGetShippingValuesProd("+ IDProd +")'>";
    sCEP+="      </div>";
    sCEP+="    </div>";
    sCEP+="    <div id='idDivImgLoadingCEPFC'><img src='"+ FC$.PathImg +"loadingCEP.gif' vspace=3 style='display:none;' id=ImgLoadingCEP></div>";
    sCEP+="    <div id='idShippingValues"+ IDProd +"'></div></div>";
    sCEP+="  </div>";
    sCEP+="</div>";
    var oShowCEP=document.getElementById("ShowCEP"+IDProd);
    if(oShowCEP)oShowCEP.innerHTML=sCEP;
  }
}


function fnGetShippingValuesProd(IDProd){
  sCEP=document.getElementById("idZip"+ IDProd).value;
  fnSetCookie('CEP'+FC$.IDLoja,sCEP);
  if(sCEP==""){document.getElementById("idShippingValues"+IDProd).innerHTML="<span class='freightResult' style=color:#990000;>Informe o CEP</span>";return;}
  document.getElementById("idShippingValues"+IDProd).innerHTML="";
  document.getElementById("ImgLoadingCEP").style.display='';
  var iQty=document.getElementById("idQtdZip"+IDProd).value;
  if(IDProd)var sParamProd="&idproduto="+ IDProd;
  else var sParamProd="";
  AjaxExecFC("/XMLShippingCEP.asp","IDLoja="+ FC$.IDLoja +"&qty="+ iQty +"&cep="+ sCEP + sParamProd,false,processXMLCEP,IDProd);
}

function processXMLCEP(obj,IDProd){
  var sShipping="";
  var oShippingValues=document.getElementById("idShippingValues"+IDProd);
  var iErr=ReadXMLNode(obj,"err");if(iErr==null)return;
  if(iErr!="0"){
    document.getElementById("ImgLoadingCEP").style.display='none';
    oShippingValues.innerHTML="<span class='freightResult' style=color:#990000;>"+ ReadXMLNode(obj,"msg") +"</span>";
    return;
  }
  oShippingValues.innerHTML="";
  var UseCart=ReadXMLNode(obj,"UseCart");
  if(UseCart=="False"){
    var ProdName=ReadXMLNode(obj,"ProdName");
    var ProdRef=ReadXMLNode(obj,"ProdRef");  
  }
  sShipping+="<div class='ZipOptions'>";
  var iOpt=ReadXMLNode(obj,"OptQt");
  for(var i=1;i<=iOpt;i++){
    var OptName=ReadXMLNode(obj,"Opt"+ i +"Name");
    var OptImage=ReadXMLNode(obj,"Opt"+ i +"Image");
    var OptObs=ReadXMLNode(obj,"Opt"+ i +"Obs");
    if(OptObs==null)OptObs="";
    sValorFrete=ReadXMLNode(obj,"Opt"+ i +"Value");
    if(sValorFrete=="R$ 0,00")sValorFrete="FRETE GR�TIS";
    sShipping+="<div class='ZipOption'>";
    sShipping+="  <div class='ZipNameObs'>";
    sShipping+="    <div class='ZipName'>"+ OptName +"</div>";
    sShipping+="    <div class='ZipObsVal'>"+ OptObs +"</div>";
    sShipping+="  </div>";
    sShipping+="  <div class='ZipValue'>"+ sValorFrete +"</div>";
    sShipping+="</div>";
  }
  oShippingValues.innerHTML=sShipping;
  oShippingValues.style.display="block"; 
  sShipping+="</div>";
  document.getElementById("ImgLoadingCEP").style.display='none';
}

function fnGetCookie(name){
  var arg=name+"=";
  var alen=arg.length;
  var clen=document.cookie.length;
  var i=0;
  while (i<clen){
    var j=i+alen;
    if(document.cookie.substring(i,j)==arg)return fnGetCookieVal(j);
    i=document.cookie.indexOf(" ",i)+1;
    if(i==0)break;
  }
  return null;
}

function fnGetCookieVal(offset){
  var endstr=document.cookie.indexOf(";",offset);
  if (endstr==-1)endstr=document.cookie.length;
  return unescape(document.cookie.substring(offset,endstr));
}

function fnSetCookie(name,value){
  var argv=fnSetCookie.arguments;
  var argc=fnSetCookie.arguments.length;
  var expires=(argc>2)?argv[2]:null;
  var path=(argc>3)?argv[3]:null;
  var domain=(argc>4)?argv[4]:null;
  var secure=(argc>5)?argv[5]:false;
  document.cookie=name+"="+escape(value)+((expires==null)?"":(";expires=" + expires.toGMTString()))+((path==null)?"":(";path="+path))+((domain==null)?"":(";domain="+domain))+((secure==true)?"; secure":"");
}

// Frete - CEP - End


// Fun��es executadas no rodap�

function fnFooter(){

  //Convert Nav UL > LI to Select
  jQuery(function () {
    // Menu Produtos
    jQuery('#FooterNav1').tinyNav({
      header: 'Produtos'
    });
    // Menu Minha Conta
    jQuery('#FooterNav2').tinyNav({
      header: 'Minha Conta'
    });
    // Menu Informa��es
    jQuery('#FooterNav3').tinyNav({
      header: 'Informa��es'
    });
  });

  FCLib$.onReady(sF$.fnCustomizeIconsSocialNetworks(false));

  if(FC$.Page=="Products"){
    if(iQtdProds>2){
      var oScript=document.createElement('script');
      oScript.type='text/javascript';
      oScript.async=true;
      oScript.src=FC$.PathHtm+'IncPaginacaoOrder.js';
      var sAddScript=document.getElementsByTagName('script')[0];
      sAddScript.parentNode.insertBefore(oScript,sAddScript);
    }
  }

  jQuery(document).ready(function() {
    var oHistoryPages=sF$.fnLoadXMLPageHistory();
    sF$.fnShowPageHistory(oHistoryPages);
  });
  
  sF$.fnLogout();
  fnShowYear();

  FCLib$.ShowBadgeFC();
  var ListVerify=document.querySelector('.ProductList');
  if (FC$.Page=="Products" && ListVerify){
    document.querySelector('#idFCContent').setAttribute('class','col-large-9 col-xlarge-10');
  };

  FCLib$.onReady(FCLib$.execWaveInterchange);
}

function fnFooterPed(){
  fnShowYear();
}

function fnShowYear(){
  //Show year Rodape.htm
  var footerDate = new Date();
  var footerYearDisplay = footerDate.getFullYear();
  var oFooterFullYear=document.getElementById("FooterFullYear");
  if(oFooterFullYear)oFooterFullYear.innerHTML = footerYearDisplay;
}
// Fun��es executadas no rodap�


/*Executa Toolbar*/
function ToolbarCartExec(){
  //Toolbar
  var TemScroll = false;
  jQuery(window).scroll(function(event) {
    if(jQuery(window).scrollTop() > 150 && !TemScroll){
      jQuery('.FCToolBar').fadeIn(300);
    }else{jQuery('.FCToolBar').fadeOut(150);}
  });

  //hover do menu
  jQuery('.zf-topMainNav ul > li > a').each(function(){
    jQuery(this).hover(function() {
      jQuery(this,'a').css('display', 'block').stop().animate({marginTop: '-3px'}, 100);
    }, function(){
      jQuery(this,'a').stop().animate({marginTop: '3px'}, 100);
    });
  });
}

// mixitUp
function execMixClasses(){
  var catBlock = jQuery('.CatContainerFC');
  jQuery(catBlock).each(function(){
    jQuery(this).addClass('mix');
  });
  jQuery('.CatBlockFC').attr('id', 'Container');
  jQuery(function(){jQuery('#Container').mixItUp();});
  FCLib$.onReady(
    function(){
    var elCat = document.querySelectorAll('.FCBtnMixit');
    elCat[0].setAttribute("class", "FCBtnMixit sort active");
  });  
}

function MobileMenuClick(){
  var isVisible = false;
  jQuery(".SmallMenuButtom").click(function(){
    if(isVisible === false){
      jQuery('.SmallMenuList').slideDown();
      jQuery('.SmallMenuIcon').html('<svg width="18" height="18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><g id="icomoon-ignore"><line stroke-width="1" x1="" y1="" x2="" y2="" stroke="#449FDB" opacity=""></line></g><path d="M27.414 12.586l-10-10c-0.781-0.781-2.047-0.781-2.828 0l-10 10c-0.781 0.781-0.781 2.047 0 2.828s2.047 0.781 2.828 0l6.586-6.586v19.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-19.172l6.586 6.586c0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586c0.781-0.781 0.781-2.047 0-2.828z" fill="#fff"></path></svg>');
    }else{
      jQuery('.SmallMenuList').slideUp();
      jQuery('.SmallMenuIcon').html('<svg width="18" height="18" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><g id="icomoon-ignore">  <line fill="none" stroke="#449FDB" x1="0" y1="0" x2="0" y2="0"></line></g><path fill="#FFFFFF" d="M25.6,14.4H6.4c-0.883,0-1.6,0.717-1.6,1.6s0.717,1.6,1.6,1.6h19.2c0.885,0,1.601-0.717,1.601-1.6 S26.484,14.4,25.6,14.4z M6.4,11.2h19.2c0.885,0,1.601-0.717,1.601-1.6C27.2,8.717,26.484,8,25.6,8H6.4C5.517,8,4.8,8.717,4.8,9.6 C4.8,10.483,5.517,11.2,6.4,11.2z M25.6,20.8H6.4c-0.883,0-1.6,0.716-1.6,1.601S5.517,24,6.4,24h19.2c0.885,0,1.601-0.715,1.601-1.6 S26.484,20.8,25.6,20.8z"></path></svg>');
    }
    isVisible = !isVisible;
  });
}


var bCascate=false;
function NoCascate(sURL){
  if(!bCascate){
    bCascate=true;
    location.href=sURL;
  }
  else bCascate=false;
}

// Scripts para o Gerador de buscas
function Gerador_Ajuda(){

  

  if (document.getElementById("TP").checked == true){
    fnGetAjax('#topo', 'fc/Topo_Ajuda.htm')

  }
 

  if (document.getElementById("BB").checked == true) {

    fnGetAjax('#boleto','fc/Boleto_Ajuda.htm')


  }

  if (document.getElementById("CD").checked == true) {

    fnGetAjax('#cartao','fc/Cartao_Ajuda.htm')

  }

  if (document.getElementById("DB").checked == true){

    fnGetAjax('#deposito','fc/Deposito_Ajuda.htm')

  }

  if (document.getElementById("MP").checked == true) {

    fnGetAjax('#mercadopago','fc/MercadoPago_Ajuda.htm')
  }

  if (document.getElementById("M").checked == true) {
    fnGetAjax('#moip','fc/Moip_Ajuda.htm')

  }

  if (document.getElementById("PP").checked == true) {
    fnGetAjax('#paypal','fc/PayPal_Ajuda.htm')

  }

  if (document.getElementById("PS").checked == true) {
    fnGetAjax('#pagseguro','fc/PagSeguro_Ajuda.htm')

  }

  if (document.getElementById("RP").checked == true){

    fnGetAjax('#rodape', 'fc/Rodape_Ajuda.htm') 

  }
}

function Limpa_Ajuda(){


   for (i=0;i<document.gerador.elements.length;i++) 
      if(document.gerador.elements[i].type == "checkbox")  
         document.gerador.elements[i].checked=0 
 

  document.getElementById('block_cod').innerHTML =
'<div id="topo">'+

'</div>'+

'<div id="boleto" class="codigo">'+

'</div>'+

'<div id="cartao" class="codigo">'+

'</div>'+

'<div id="deposito" class="codigo">'+

'</div>'+

'<div id="mercadopago" class="codigo">'+

'</div>'+

'<div id="moip" class="codigo">'+

'</div>'+

'<div id="paypal" class="codigo">'+

'</div>'+

'<div id="pagseguro" class="codigo">'+

'</div>'+

'<div id="rodape" class="codigo">'+

'</div>';


}

function Marcar_checkbox(){

   for (i=0;i<document.gerador.elements.length;i++)
      if(document.gerador.elements[i].type == "checkbox")
         document.gerador.elements[i].checked=1
        }

function fnGetAjax(element, file){  var getHTTPObject=function(){if(window.XMLHttpRequest){return new XMLHttpRequest()}else if(window.ActiveXObject){return new ActiveXObject("Microsoft.XMLHTTP")}else{return null}}; var xmlHttp=getHTTPObject();if(xmlHttp!==null){xmlHttp.open("GET",FC$.PathHtm+file,true); xmlHttp.onreadystatechange=function(){if(xmlHttp.readyState==4){document.querySelector(element).innerHTML=xmlHttp.responseText;}};xmlHttp.send( null );}}
