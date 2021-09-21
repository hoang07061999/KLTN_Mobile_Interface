Lang={locale:'en',languages:{},setLocale:function(locale){this.locale=locale;},getLocale:function(){return this.locale;},loadTranslations:function(lang,locale){if(locale===undefined){locale=this.locale;}
if(this.languages[locale]===undefined){this.languages[locale]={};}
for(var key in lang){this.languages[locale][key]=lang[key];}
return this.languages;},get:function(key,parameters,locale){if(key===undefined||key.length===0){return '';}
if(locale===undefined){locale=this.locale;}
if(parameters===undefined){parameters={};}
var languagePack=this.languages[locale];var translation=languagePack[key];if(translation===undefined){translation=key;}
for(var k in parameters){var v=parameters[k];translation=translation.replace(':'+k,v);}
return translation;},};function __(key,parameters,locale)
{return Lang.get(key,parameters,locale);}