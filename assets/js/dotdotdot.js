/*
 *  jQuery dotdotdot 1.5.4
 *
 *  Copyright (c) 2013 Fred Heusschen
 *  www.frebsite.nl
 *
 *  Plugin website:
 *  dotdotdot.frebsite.nl
 *
 *  Dual licensed under the MIT and GPL licenses.
 *  http://en.wikipedia.org/wiki/MIT_License
 *  http://en.wikipedia.org/wiki/GNU_General_Public_License
 */


eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(6($){4($.C.t){5}$.C.t=6(o){4(q.D==0){1d(A,\'1T 1U 1V Y "\'+q.1W+\'".\');5 q}4(q.D>1){5 q.1X(6(){$(q).t(o)})}7 d=q;4(d.R(\'t\')){d.L(\'1y.w\')}d.1z=6(){d.S(\'M.w\',6(e,c){e.Z();e.11();9.1e=(r 9.x==\'1Y\')?9.x:1A(d);9.1e+=9.1B;4(r c!=\'E\'){4(r c==\'1f\'||c 1C 1Z){c=$(\'<1g />\').F(c).G()}4(c 1C $){f=c}}$y=d.20(\'<1g 21="t" />\').T();$y.12().F(f.1D(A)).1E({\'x\':\'1F\',\'H\':\'1F\',\'22\':\'23\',\'24\':0,\'25\':0});7 a=8,N=8;4(v.13){a=v.13.1D(A);v.13.B()}4(U($y,9)){4(9.1h==\'T\'){N=T($y,9,a)}u{N=O($y,d,$y,9,a)}}$y.26($y.G());$y=P;4($.27(9.1i)){9.1i.I(d[0],N,f)}v.s=N;5 N}).S(\'s.w\',6(e,a){e.Z();e.11();4(r a==\'6\'){a.I(d[0],v.s)}5 v.s}).S(\'28.w\',6(e,a){e.Z();e.11();4(r a==\'6\'){a.I(d[0],f)}5 f}).S(\'1y.w\',6(e){e.Z();e.11();d.1j().1G().12().F(f).R(\'t\',8)});5 d};d.1G=6(){d.1H(\'.w\');5 d};d.V=6(){d.1j();4(9.V==\'Q\'){7 b=$(Q),1k=b.H(),1l=b.x();b.S(\'1I.w\'+v.1m,6(){4(1k!=b.H()||1l!=b.x()||!9.1J){1k=b.H();1l=b.x();4(J){1K(J)}J=29(6(){d.L(\'M.w\')},10)}})}u{W=14(d);J=2a(6(){7 a=14(d);4(W.H!=a.H||W.x!=a.x){d.L(\'M.w\');W=14(d)}},2b)}5 d};d.1j=6(){$(Q).1H(\'1I.w\'+v.1m);4(J){1K(J)}5 d};7 f=d.G(),9=$.2c(A,{},$.C.t.1L,o),v={},W={},J=P,$y=P;v.13=1M(9.1n,d);v.s=8;v.1m=k++;d.R(\'t\',A).1z().L(\'M.w\');4(9.V){d.V()}5 d};$.C.t.1L={\'O\':\'... \',\'1h\':\'2d\',\'1o\':{\'B\':[\' \',\',\',\';\',\'.\',\'!\',\'?\'],\'1N\':[]},\'1B\':0,\'1i\':P,\'1n\':P,\'x\':P,\'V\':8,\'1J\':A,\'1d\':8};7 k=1;6 T(b,o,c){7 d=b.T(),s=8;b.12();Y(7 a=0,l=d.D;a<l;a++){7 e=d.1p(a);b.F(e);4(c){b.F(c)}4(U(b,o)){e.B();s=A;1q}u{4(c){c.B()}}}5 s}6 O(b,c,d,o,f){7 g=b.G(),s=8;b.12();7 h=\'2e, 2f, 2g, 2h, 2i, 2j, 2k, 1O, 2l, 2m, 2n, 2o, 2p, 2q, 2r, 2s, 2t, 2u, 2v\';Y(7 a=0,l=g.D;a<l;a++){4(s){1q}7 e=g[a],$e=$(e);4(r e==\'E\'){2w}b.F($e);4(f){b[(b.2x(h))?\'1n\':\'F\'](f)}4(e.2y==3){4(U(d,o)){s=1r($e,c,d,o,f)}}u{s=O($e,c,d,o,f)}4(!s){4(f){f.B()}}}5 s}6 1r(a,b,c,o,d){7 f=8,e=a[0];4(r e==\'E\'){5 8}7 g=(o.1h==\'2z\')?\'\':\' \',15=1s(e).2A(g),16=-1,K=-1,17=0,18=15.D-1;1P(17<=18){7 m=2B.2C((17+18)/2);4(m==K){1q}K=m;19(e,15.X(0,K+1).1Q(g)+o.O);4(!U(c,o)){16=K;17=K}u{18=K}}4(16!=-1){7 h=1t(15.X(0,16+1).1Q(g),o);f=A;19(e,h)}u{7 i=a.2D();a.B();4(i.G().2E()>0){7 j=i.G().1p(-1-((d)?d.D:0));f=1r(j,b,c,o,d)}u{7 e=i.2F().G().1p(-1)[0],h=1t(1s(e),o);19(e,h);f=A;i.B()}}5 f}6 U(a,o){5 a.1u()>o.1e}6 1t(a,o){1P($.1R(a.X(-1),o.1o.B)>-1){a=a.X(0,-1)}4($.1R(a.X(-1),o.1o.1N)<0){a+=o.O}5 a}6 14(a){5{\'H\':a.2G(),\'x\':a.1u()}}6 19(e,a){4(e.1a){e.1a=a}u 4(e.1b){e.1b=a}u 4(e.1c){e.1c=a}}6 1s(e){4(e.1a){5 e.1a}u 4(e.1b){5 e.1b}u 4(e.1c){5 e.1c}u{5""}}6 1M(e,a){4(r e==\'E\'){5 8}4(!e){5 8}4(r e==\'1f\'){e=$(e,a);5(e.D)?e:8}4(r e==\'1O\'){5(r e.2H==\'E\')?8:e}5 8}6 1A(b){7 h=b.1u(),a=[\'2I\',\'2J\'];Y(z=0,l=a.D;z<l;z++){7 m=2K(b.1E(a[z]),10);4(2L(m)){m=0}h-=m}5 h}6 1d(d,m){4(!d){5 8}4(r m==\'1f\'){m=\'t: \'+m}u{m=[\'t:\',m]}4(Q.1v&&Q.1v.1S){Q.1v.1S(m)}5 8}7 n=$.C.1w;$.C.1w=6(a){4(r a!=\'E\'){4(q.R(\'t\')){4(r a!=\'6\'){5 q.L(\'M\',[a])}}5 n.I(q,a)}5 n.I(q)};7 p=$.C.1x;$.C.1x=6(a){4(r a!=\'E\'){4(q.R(\'t\')){7 b=$(\'<1g />\');b.1x(a);a=b.1w();b.B();5 q.L(\'M\',[a])}5 p.I(q,a)}5 p.I(q)}})(2M);',62,173,'||||if|return|function|var|false|opts|||||||||||||||||this|typeof|isTruncated|dotdotdot|else|conf|dot|height|inr||true|remove|fn|length|undefined|append|contents|width|call|watchInt|midPos|trigger|update|trunc|ellipsis|null|window|data|bind|children|test|watch|watchOrg|slice|for|preventDefault||stopPropagation|empty|afterElement|getSizes|textArr|position|startPos|endPos|setTextContent|innerText|nodeValue|textContent|debug|maxHeight|string|div|wrap|callback|unwatch|_wWidth|_wHeight|dotId|after|lastCharacter|eq|break|ellipsisElement|getTextContent|addEllipsis|innerHeight|console|html|text|destroy|bind_events|getTrueInnerHeight|tolerance|instanceof|clone|css|auto|unbind_events|unbind|resize|windowResizeFix|clearInterval|defaults|getElement|noEllipsis|object|while|join|inArray|log|No|element|found|selector|each|number|HTMLElement|wrapInner|class|border|none|padding|margin|replaceWith|isFunction|originalContent|setTimeout|setInterval|100|extend|word|table|thead|tbody|tfoot|tr|col|colgroup|embed|param|ol|ul|dl|select|optgroup|option|textarea|script|style|continue|is|nodeType|letter|split|Math|floor|parent|size|prev|innerWidth|jquery|paddingTop|paddingBottom|parseInt|isNaN|jQuery'.split('|'),0,{}))