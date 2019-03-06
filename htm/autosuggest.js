jQuery.noConflict();
jQuery(function (jQuery) {
     				     
						jQuery.widget( "custom.autocomplete", jQuery.ui.autocomplete, {
				        _renderMenu: function( ul, items ) {
				            var self = this,
				                currentCategory = "";
				            jQuery.each( items, function( index, item ) {
				                if ( item.category != currentCategory ) {
					                  ul.append( "" );
				                    currentCategory = item.category;
				                }
				                self._renderItem( ul, item );
				            });
				        }
				    });

            jQuery("#autocomplete").autocomplete({
			        select: function( event, ui ) { 
								if (ui.item.q){
									jQuery('#autocomplete-form').submit();
									return false;	         
								}
								if (ui.item.c){
									var idProducts = ui.item.id;
									window.location.href = "ListaProdutos.asp?IDLoja="+IDLojaAS+"&IDProduto="+idProducts;
									return false;	         
								}
								if (ui.item.u){
					        window.location.href = ui.item.u.replace("&amp;","&");
					        return false;           
								}
								if(ui.item.s){
									var idNews = ui.item.id;
									window.location.href = "Noticias.asp?IDLoja="+IDLojaAS+"&IDNoticia="+idNews;            
									return false;	         
								}
			        },
	            focus: function(event,ui) {
	                jQuery('input#autocomplete').val(ui.item.label
														.replace("&quot;",'"')
														.replace("&apos;","'")
														.replace("&amp;","&")
														.replace("&lt;","<")
														.replace("&gt;",">")
														.replace("&#192;","À")
														.replace("&#193;","Á")
														.replace("&#194;","Â")
														.replace("&#195;","Ã")
														.replace("&#196;","Ä")
														.replace("&#197;","Å")
														.replace("&#198;","Æ")
														.replace("&#199;","Ç")
														.replace("&#200;","È")
														.replace("&#201;","É")
														.replace("&#202;","Ê")
														.replace("&#203;","Ë")
														.replace("&#204;","Ì")
														.replace("&#205;","Í")
														.replace("&#206;","Î")
														.replace("&#207;","Ï")
														.replace("&#208;","Ð")
														.replace("&#209;","Ñ")
														.replace("&#210;","Ò")
														.replace("&#211;","Ó")
														.replace("&#212;","Ô")
														.replace("&#213;","Õ")
														.replace("&#214;","Ö")
														.replace("&#216;","Ø")
														.replace("&#217;","Ù")
														.replace("&#218;","Ú")
														.replace("&#219;","Û")
														.replace("&#220;","Ü")
														.replace("&#221;","Ý")
														.replace("&#222;","Þ")
														.replace("&#223;","ß")
														.replace("&#224;","à")
														.replace("&#225;","á")
														.replace("&#226;","â")
														.replace("&#227;","ã")
														.replace("&#228;","ä")
														.replace("&#229;","å")
														.replace("&#230;","æ")
														.replace("&#231;","ç")
														.replace("&#232;","è")
														.replace("&#233;","é")
														.replace("&#234;","ê")
														.replace("&#235;","ë")
														.replace("&#236;","ì")
														.replace("&#237;","í")
														.replace("&#238;","î")
														.replace("&#239;","ï")
														.replace("&#240;","ð")
														.replace("&#241;","ñ")
														.replace("&#242;","ò")
														.replace("&#243;","ó")
														.replace("&#244;","ô")
														.replace("&#245;","õ")
														.replace("&#246;","ö")
														.replace("&#248;","ø")
														.replace("&#249;","ù")
														.replace("&#250;","ú")
														.replace("&#251;","û")
														.replace("&#252;","ü")
														.replace("&#253;","ý")
														.replace("&#254;","þ")
														.replace("&#255;","ÿ")
	                					);
	                return false;
	            },			                                    
              source: function (request, response) {
                  jQuery.ajax({
                      url: "autosuggest.asp?idloja="+IDLojaAS+"&format=1&q="+request.term+"&g1="+g1+"&g2="+g2+"&g3="+g3+"&g4="+g4,
                      dataType: "json",
                      type: "GET",                     
                			success: function (data) {
												var json0 = data.SearchTerms;
												var json1 = data.Products;
												var json2 = data.RelatedPages;
												var json3 = data.News;
												
												
												if(jQuery.isArray(json0)) {
												    json0 = json0;
												}else{
													json0 = [  ];
												};													
												if(jQuery.isArray(json1)) {
												    json1 = json1;
												}else{
													json1 = [  ];
												};													
												if(jQuery.isArray(json2)) {
												    json2 = json2;
												}else{
													json2 = [  ];
												};													
												if(jQuery.isArray(json3)) {
												    json3 = json3;
												}else{
													json3 = [  ];
												};
																																							
												var json = [].concat(json0,json1,json2,json3);
												
																						
													//console.log(json);
												
                        response(jQuery.map(json, function (item) {
                            return {
                                category: item.category,
                            		//Termos
                            		t: item.label,
                            		q: item.q,
                                //Produtos
                                nm: item.label,
                                id: item.id,
                                c: item.c,
                                im: item.im,
                                op: item.op,
                                fp: item.fp,
                                v: item.v,
																//Paginas	
                                p: item.label,
                                u: item.u,
                                //Noticias
                                id: item.id,
                                t:item.label,
                                s: item.s,
                                d: item.d,
                                label: item.label
                                }
                        }))                         

                      },
                      error: function (a, b, c) {
                          debugger;
                      }
                  });
              },
              minLength: 3
            }).data("autocomplete")._renderItem = function(ul, item) {

								jQuery('li.active:even').css('background-color', '#f1efef');

			          		//Termos
					          if (item.q){
					          
					          var sPlural = '';
					          
					          if (item.q >1){
					          	sPlural = 's';
					          }else{
					          	sPlural = ''
					          }
					         
					         var t = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");				   
										return jQuery("<li class='active'></li>")                
                    .data("item.autocomplete", item)
										.append("<a><table width='100%'><tr valign='0'><tr><td width='100%' id='as-nome-termos'><span>"+t+"</span></td><td align='right' id='as-qtd-termos'><span>"+item.q+"&nbsp;Produto"+sPlural+"&nbsp;</span></td></tr></table></a>")
										.appendTo(ul);										
                }  

			          		//Produtos
					          if (item.c){
					          
					          if (item.fp == 0){
					          	valor = "Consulte-nos";
					          }else{
					          	valor = FormatPrice(item.fp,'R$');
					          }

					          if(item.fp!=item.op){
					            sSale="<span style='background-color:#65984d;color:#ffffff;padding:3px;'>&nbsp;"+FormatNum(((item.op-item.fp)/item.op)*100)+"%&nbsp;off&nbsp;</span>&nbsp;&nbsp;";}
					          else{
					            sSale=""
					          }
					          
					          var nm = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");				
					          return jQuery("<li class='active'></li>")                
                    .data("item.autocomplete", item)                    
										.append("<a><table width='100%'><tr valign='0'><tr><td align=center width='55px'><span><img src='"+ CaminhoProdAS  + item.im + "' id='as-img-prod'></span></td><td width='55%'><span id='as-nome-prod'>" + nm + "</a></span><br/><span id='as-cat-prod'>" + item.c + "</span></td><td width=25 class='as-sale'>"+ sSale +"</td><td align='right' id='as-valor-prod' nowrap='nowrap'><span>" + valor +"</span></td></tr></table></a>")										
										.appendTo(ul);
                }   
                		//Paginas            
					          if (item.u){           
					          var p = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");				   
                    return jQuery("<li class='active'></li>")
                    .data("item.autocomplete", item)
										.append("<a><table width='100%'><tr valign='0'><td id='as-nome-pag'><a href='" + item.u + "'>" + p + "</a></td></tr></table></a>")
										.appendTo(ul);										
                }
                		//Noticias
					          if (item.s){        
					          var t = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + jQuery.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");				   
                    return jQuery("<li class='active'></li>")
                    .data("item.autocomplete", item)
										.append("<a><table width='400'><tr valign='0'><td width='65%' id='as-nome-not'>" + t + "</td></tr></table></a>")
										.appendTo(ul);										
                }
              }
        });
