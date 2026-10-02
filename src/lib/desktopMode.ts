export const DESKTOP_LAYOUT_WIDTH = 1440;

/** Runs in <head> before paint so desktop-mode phones skip the lock screen. */
export const DESKTOP_BOOT_SCRIPT = `(function(){
  var W=${DESKTOP_LAYOUT_WIDTH};
  var ua=navigator.userAgent||"";
  var path=location.pathname||"/";
  var bot=/Googlebot|Google-InspectionTool|bingbot|BingPreview|Baiduspider|Yandex|DuckDuckBot|Slurp|GPTBot|ChatGPT|ClaudeBot|Perplexity|Applebot|Bytespider|facebookexternalhit|LinkedInBot|Twitterbot|Slackbot/i.test(ua);
  var publicPage=path!=="/";
  function phone(){
    var min=Math.min(screen.width||0,screen.height||0);
    var touch=(navigator.maxTouchPoints||0)>0||"ontouchend" in document;
    return touch&&min>0&&min<600;
  }
  function desktopSite(){
    if(!phone()) return false;
    var ch=navigator.userAgentData;
    if(ch&&typeof ch.mobile==="boolean") return ch.mobile===false;
    if(/Macintosh/i.test(ua)&&(navigator.maxTouchPoints||0)>1) return true;
    if(/Android/i.test(ua)&&!/Mobile/i.test(ua)) return true;
    if(!/iPhone|iPod|Mobile/i.test(ua)) return true;
    var vw=Math.max(window.innerWidth||0,document.documentElement.clientWidth||0);
    return vw>=980;
  }
  function allowed(){
    if(bot||publicPage) return true;
    if(desktopSite()) return true;
    return window.innerWidth>=1100;
  }
  function apply(){
    var ok=allowed();
    document.documentElement.setAttribute("data-display-mode",ok?"desktop":"mobile");
    var meta=document.querySelector('meta[name="viewport"]');
    if(!meta) return;
    meta.setAttribute("content", ok&&phone()&&!publicPage&&!bot ? ("width="+W) : "width=device-width, initial-scale=1");
  }
  apply();
  window.addEventListener("resize",apply,{passive:true});
  window.addEventListener("orientationchange",apply,{passive:true});
})();`;
