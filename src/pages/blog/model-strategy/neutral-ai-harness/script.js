(function(){
var root=document.getElementById('hw-nah-explorer');if(!root)return;
var tabs=root.querySelectorAll('.hw-tab');
function select(t){
for(var i=0;i<tabs.length;i++){
var on=tabs[i]===t;
tabs[i].setAttribute('aria-selected',on?'true':'false');
tabs[i].setAttribute('tabindex',on?'0':'-1');
var p=document.getElementById(tabs[i].getAttribute('aria-controls'));
if(p){p.classList.toggle('is-active',on);}
}
}
for(var i=0;i<tabs.length;i++){
tabs[i].addEventListener('click',function(){select(this);});
tabs[i].addEventListener('keydown',function(e){
var idx=Array.prototype.indexOf.call(tabs,this),n=null;
if(e.key==='Enter'||e.key===' '){e.preventDefault();select(this);return;}
if(e.key==='ArrowRight')n=tabs[(idx+1)%tabs.length];
if(e.key==='ArrowLeft')n=tabs[(idx-1+tabs.length)%tabs.length];
if(n){e.preventDefault();select(n);n.focus();}
});
}
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37586,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1702,"estimatedReadTimeSeconds":429,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before
