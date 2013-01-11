var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.provide = function $goog$provide$($name$$) {
  if(!COMPILED) {
    if(goog.isProvided_($name$$)) {
      throw Error('Namespace "' + $name$$ + '" already declared.');
    }
    delete goog.implicitNamespaces_[$name$$];
    for(var $namespace$$ = $name$$;($namespace$$ = $namespace$$.substring(0, $namespace$$.lastIndexOf("."))) && !goog.getObjectByName($namespace$$);) {
      goog.implicitNamespaces_[$namespace$$] = !0
    }
  }
  goog.exportPath_($name$$)
};
goog.setTestOnly = function $goog$setTestOnly$($opt_message$$) {
  if(COMPILED && !goog.DEBUG) {
    throw $opt_message$$ = $opt_message$$ || "", Error("Importing test-only code into non-debug environment" + $opt_message$$ ? ": " + $opt_message$$ : ".");
  }
};
COMPILED || (goog.isProvided_ = function $goog$isProvided_$($name$$) {
  return!goog.implicitNamespaces_[$name$$] && !!goog.getObjectByName($name$$)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function $goog$exportPath_$($name$$, $opt_object$$, $cur_opt_objectToExportTo$$) {
  $name$$ = $name$$.split(".");
  $cur_opt_objectToExportTo$$ = $cur_opt_objectToExportTo$$ || goog.global;
  !($name$$[0] in $cur_opt_objectToExportTo$$) && $cur_opt_objectToExportTo$$.execScript && $cur_opt_objectToExportTo$$.execScript("var " + $name$$[0]);
  for(var $part$$;$name$$.length && ($part$$ = $name$$.shift());) {
    !$name$$.length && goog.isDef($opt_object$$) ? $cur_opt_objectToExportTo$$[$part$$] = $opt_object$$ : $cur_opt_objectToExportTo$$ = $cur_opt_objectToExportTo$$[$part$$] ? $cur_opt_objectToExportTo$$[$part$$] : $cur_opt_objectToExportTo$$[$part$$] = {}
  }
};
goog.getObjectByName = function $goog$getObjectByName$($name$$, $opt_obj$$) {
  for(var $parts$$ = $name$$.split("."), $cur$$ = $opt_obj$$ || goog.global, $part$$;$part$$ = $parts$$.shift();) {
    if(goog.isDefAndNotNull($cur$$[$part$$])) {
      $cur$$ = $cur$$[$part$$]
    }else {
      return null
    }
  }
  return $cur$$
};
goog.globalize = function $goog$globalize$($obj$$, $opt_global$$) {
  var $global$$ = $opt_global$$ || goog.global, $x$$;
  for($x$$ in $obj$$) {
    $global$$[$x$$] = $obj$$[$x$$]
  }
};
goog.addDependency = function $goog$addDependency$($path$$, $provides_require$$, $requires$$) {
  if(!COMPILED) {
    var $j_provide$$;
    $path$$ = $path$$.replace(/\\/g, "/");
    for(var $deps$$ = goog.dependencies_, $i$$ = 0;$j_provide$$ = $provides_require$$[$i$$];$i$$++) {
      $deps$$.nameToPath[$j_provide$$] = $path$$, $path$$ in $deps$$.pathToNames || ($deps$$.pathToNames[$path$$] = {}), $deps$$.pathToNames[$path$$][$j_provide$$] = !0
    }
    for($j_provide$$ = 0;$provides_require$$ = $requires$$[$j_provide$$];$j_provide$$++) {
      $path$$ in $deps$$.requires || ($deps$$.requires[$path$$] = {}), $deps$$.requires[$path$$][$provides_require$$] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function $goog$require$($errorMessage_name$$) {
  if(!COMPILED && !goog.isProvided_($errorMessage_name$$)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var $path$$ = goog.getPathFromDeps_($errorMessage_name$$);
      if($path$$) {
        goog.included_[$path$$] = !0;
        goog.writeScripts_();
        return
      }
    }
    $errorMessage_name$$ = "goog.require could not find: " + $errorMessage_name$$;
    goog.global.console && goog.global.console.error($errorMessage_name$$);
    throw Error($errorMessage_name$$);
  }
};
goog.basePath = "";
goog.nullFunction = function $goog$nullFunction$() {
};
goog.identityFunction = function $goog$identityFunction$($opt_returnValue$$) {
  return $opt_returnValue$$
};
goog.abstractMethod = function $goog$abstractMethod$() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function $goog$addSingletonGetter$($ctor$$) {
  $ctor$$.getInstance = function $$ctor$$$getInstance$() {
    if($ctor$$.instance_) {
      return $ctor$$.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = $ctor$$);
    return $ctor$$.instance_ = new $ctor$$
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function $goog$inHtmlDocument_$() {
  var $doc$$ = goog.global.document;
  return"undefined" != typeof $doc$$ && "write" in $doc$$
}, goog.findBasePath_ = function $goog$findBasePath_$() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var $scripts$$ = goog.global.document.getElementsByTagName("script"), $i$$ = $scripts$$.length - 1;0 <= $i$$;--$i$$) {
        var $src$$ = $scripts$$[$i$$].src, $l_qmark$$ = $src$$.lastIndexOf("?"), $l_qmark$$ = -1 == $l_qmark$$ ? $src$$.length : $l_qmark$$;
        if("base.js" == $src$$.substr($l_qmark$$ - 7, 7)) {
          goog.basePath = $src$$.substr(0, $l_qmark$$ - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function $goog$importScript_$($src$$) {
  var $importScript$$ = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[$src$$] && $importScript$$($src$$) && (goog.dependencies_.written[$src$$] = !0)
}, goog.writeScriptTag_ = function $goog$writeScriptTag_$($src$$) {
  if(goog.inHtmlDocument_()) {
    var $doc$$ = goog.global.document;
    if("complete" == $doc$$.readyState) {
      if(/\bdeps.js$/.test($src$$)) {
        return!1
      }
      throw Error('Cannot write "' + $src$$ + '" after document load');
    }
    $doc$$.write('<script type="text/javascript" src="' + $src$$ + '">\x3c/script>');
    return!0
  }
  return!1
}, goog.writeScripts_ = function $goog$writeScripts_$() {
  function $visitNode$$($path$$) {
    if(!($path$$ in $deps$$.written)) {
      if(!($path$$ in $deps$$.visited) && ($deps$$.visited[$path$$] = !0, $path$$ in $deps$$.requires)) {
        for(var $requireName$$ in $deps$$.requires[$path$$]) {
          if(!goog.isProvided_($requireName$$)) {
            if($requireName$$ in $deps$$.nameToPath) {
              $visitNode$$($deps$$.nameToPath[$requireName$$])
            }else {
              throw Error("Undefined nameToPath for " + $requireName$$);
            }
          }
        }
      }
      $path$$ in $seenScript$$ || ($seenScript$$[$path$$] = !0, $scripts$$.push($path$$))
    }
  }
  var $scripts$$ = [], $seenScript$$ = {}, $deps$$ = goog.dependencies_, $i$$4_path$$;
  for($i$$4_path$$ in goog.included_) {
    $deps$$.written[$i$$4_path$$] || $visitNode$$($i$$4_path$$)
  }
  for($i$$4_path$$ = 0;$i$$4_path$$ < $scripts$$.length;$i$$4_path$$++) {
    if($scripts$$[$i$$4_path$$]) {
      goog.importScript_(goog.basePath + $scripts$$[$i$$4_path$$])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function $goog$getPathFromDeps_$($rule$$) {
  return $rule$$ in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[$rule$$] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function $goog$typeOf$($value$$) {
  var $s$$ = typeof $value$$;
  if("object" == $s$$) {
    if($value$$) {
      if($value$$ instanceof Array) {
        return"array"
      }
      if($value$$ instanceof Object) {
        return $s$$
      }
      var $className$$ = Object.prototype.toString.call($value$$);
      if("[object Window]" == $className$$) {
        return"object"
      }
      if("[object Array]" == $className$$ || "number" == typeof $value$$.length && "undefined" != typeof $value$$.splice && "undefined" != typeof $value$$.propertyIsEnumerable && !$value$$.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == $className$$ || "undefined" != typeof $value$$.call && "undefined" != typeof $value$$.propertyIsEnumerable && !$value$$.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == $s$$ && "undefined" == typeof $value$$.call) {
      return"object"
    }
  }
  return $s$$
};
goog.isDef = function $goog$isDef$($val$$) {
  return void 0 !== $val$$
};
goog.isNull = function $goog$isNull$($val$$) {
  return null === $val$$
};
goog.isDefAndNotNull = function $goog$isDefAndNotNull$($val$$) {
  return null != $val$$
};
goog.isArray = function $goog$isArray$($val$$) {
  return"array" == goog.typeOf($val$$)
};
goog.isArrayLike = function $goog$isArrayLike$($val$$) {
  var $type$$ = goog.typeOf($val$$);
  return"array" == $type$$ || "object" == $type$$ && "number" == typeof $val$$.length
};
goog.isDateLike = function $goog$isDateLike$($val$$) {
  return goog.isObject($val$$) && "function" == typeof $val$$.getFullYear
};
goog.isString = function $goog$isString$($val$$) {
  return"string" == typeof $val$$
};
goog.isBoolean = function $goog$isBoolean$($val$$) {
  return"boolean" == typeof $val$$
};
goog.isNumber = function $goog$isNumber$($val$$) {
  return"number" == typeof $val$$
};
goog.isFunction = function $goog$isFunction$($val$$) {
  return"function" == goog.typeOf($val$$)
};
goog.isObject = function $goog$isObject$($val$$) {
  var $type$$ = typeof $val$$;
  return"object" == $type$$ && null != $val$$ || "function" == $type$$
};
goog.getUid = function $goog$getUid$($obj$$) {
  return $obj$$[goog.UID_PROPERTY_] || ($obj$$[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function $goog$removeUid$($obj$$) {
  "removeAttribute" in $obj$$ && $obj$$.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete $obj$$[goog.UID_PROPERTY_]
  }catch($ex$$) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function $goog$cloneObject$($obj$$) {
  var $clone_type$$ = goog.typeOf($obj$$);
  if("object" == $clone_type$$ || "array" == $clone_type$$) {
    if($obj$$.clone) {
      return $obj$$.clone()
    }
    var $clone_type$$ = "array" == $clone_type$$ ? [] : {}, $key$$;
    for($key$$ in $obj$$) {
      $clone_type$$[$key$$] = goog.cloneObject($obj$$[$key$$])
    }
    return $clone_type$$
  }
  return $obj$$
};
goog.bindNative_ = function $goog$bindNative_$($fn$$, $selfObj$$, $var_args$$) {
  return $fn$$.call.apply($fn$$.bind, arguments)
};
goog.bindJs_ = function $goog$bindJs_$($fn$$, $selfObj$$, $var_args$$) {
  if(!$fn$$) {
    throw Error();
  }
  if(2 < arguments.length) {
    var $boundArgs$$ = Array.prototype.slice.call(arguments, 2);
    return function() {
      var $newArgs$$ = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply($newArgs$$, $boundArgs$$);
      return $fn$$.apply($selfObj$$, $newArgs$$)
    }
  }
  return function() {
    return $fn$$.apply($selfObj$$, arguments)
  }
};
goog.bind = function $goog$bind$($fn$$, $selfObj$$, $var_args$$) {
  goog.bind = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function $goog$partial$($fn$$, $var_args$$) {
  var $args$$ = Array.prototype.slice.call(arguments, 1);
  return function() {
    var $newArgs$$ = Array.prototype.slice.call(arguments);
    $newArgs$$.unshift.apply($newArgs$$, $args$$);
    return $fn$$.apply(this, $newArgs$$)
  }
};
goog.mixin = function $goog$mixin$($target$$, $source$$) {
  for(var $x$$ in $source$$) {
    $target$$[$x$$] = $source$$[$x$$]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function $goog$globalEval$($script$$) {
  if(goog.global.execScript) {
    goog.global.execScript($script$$, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval($script$$)
      }else {
        var $doc$$ = goog.global.document, $scriptElt$$ = $doc$$.createElement("script");
        $scriptElt$$.type = "text/javascript";
        $scriptElt$$.defer = !1;
        $scriptElt$$.appendChild($doc$$.createTextNode($script$$));
        $doc$$.body.appendChild($scriptElt$$);
        $doc$$.body.removeChild($scriptElt$$)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function $goog$getCssName$($className$$, $opt_modifier$$) {
  var $getMapping$$ = function $$getMapping$$$($cssName$$) {
    return goog.cssNameMapping_[$cssName$$] || $cssName$$
  }, $rename_renameByParts$$ = function $$rename_renameByParts$$$($cssName$$1_parts$$) {
    $cssName$$1_parts$$ = $cssName$$1_parts$$.split("-");
    for(var $mapped$$ = [], $i$$ = 0;$i$$ < $cssName$$1_parts$$.length;$i$$++) {
      $mapped$$.push($getMapping$$($cssName$$1_parts$$[$i$$]))
    }
    return $mapped$$.join("-")
  }, $rename_renameByParts$$ = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? $getMapping$$ : $rename_renameByParts$$ : function($a$$) {
    return $a$$
  };
  return $opt_modifier$$ ? $className$$ + "-" + $rename_renameByParts$$($opt_modifier$$) : $rename_renameByParts$$($className$$)
};
goog.setCssNameMapping = function $goog$setCssNameMapping$($mapping$$, $opt_style$$) {
  goog.cssNameMapping_ = $mapping$$;
  goog.cssNameMappingStyle_ = $opt_style$$
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function $goog$getMsg$($str$$, $opt_values$$) {
  var $values$$ = $opt_values$$ || {}, $key$$;
  for($key$$ in $values$$) {
    var $value$$ = ("" + $values$$[$key$$]).replace(/\$/g, "$$$$");
    $str$$ = $str$$.replace(RegExp("\\{\\$" + $key$$ + "\\}", "gi"), $value$$)
  }
  return $str$$
};
goog.getMsgWithFallback = function $goog$getMsgWithFallback$($a$$) {
  return $a$$
};
goog.exportSymbol = function $goog$exportSymbol$($publicPath$$, $object$$, $opt_objectToExportTo$$) {
  goog.exportPath_($publicPath$$, $object$$, $opt_objectToExportTo$$)
};
goog.exportProperty = function $goog$exportProperty$($object$$, $publicName$$, $symbol$$) {
  $object$$[$publicName$$] = $symbol$$
};
goog.inherits = function $goog$inherits$($childCtor$$, $parentCtor$$) {
  function $tempCtor$$() {
  }
  $tempCtor$$.prototype = $parentCtor$$.prototype;
  $childCtor$$.superClass_ = $parentCtor$$.prototype;
  $childCtor$$.prototype = new $tempCtor$$;
  $childCtor$$.prototype.constructor = $childCtor$$
};
goog.base = function $goog$base$($me$$, $opt_methodName$$, $var_args$$) {
  var $caller$$ = arguments.callee.caller;
  if($caller$$.superClass_) {
    return $caller$$.superClass_.constructor.apply($me$$, Array.prototype.slice.call(arguments, 1))
  }
  for(var $args$$ = Array.prototype.slice.call(arguments, 2), $foundCaller$$ = !1, $ctor$$ = $me$$.constructor;$ctor$$;$ctor$$ = $ctor$$.superClass_ && $ctor$$.superClass_.constructor) {
    if($ctor$$.prototype[$opt_methodName$$] === $caller$$) {
      $foundCaller$$ = !0
    }else {
      if($foundCaller$$) {
        return $ctor$$.prototype[$opt_methodName$$].apply($me$$, $args$$)
      }
    }
  }
  if($me$$[$opt_methodName$$] === $caller$$) {
    return $me$$.constructor.prototype[$opt_methodName$$].apply($me$$, $args$$)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function $goog$scope$($fn$$) {
  $fn$$.call(goog.global)
};
goog.debug = {};
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function $goog$debug$errorHandlerWeakDep$protectEntryPoint$($fn$$) {
  return $fn$$
}};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function $goog$string$startsWith$($str$$, $prefix$$) {
  return 0 == $str$$.lastIndexOf($prefix$$, 0)
};
goog.string.endsWith = function $goog$string$endsWith$($str$$, $suffix$$) {
  var $l$$ = $str$$.length - $suffix$$.length;
  return 0 <= $l$$ && $str$$.indexOf($suffix$$, $l$$) == $l$$
};
goog.string.caseInsensitiveStartsWith = function $goog$string$caseInsensitiveStartsWith$($str$$, $prefix$$) {
  return 0 == goog.string.caseInsensitiveCompare($prefix$$, $str$$.substr(0, $prefix$$.length))
};
goog.string.caseInsensitiveEndsWith = function $goog$string$caseInsensitiveEndsWith$($str$$, $suffix$$) {
  return 0 == goog.string.caseInsensitiveCompare($suffix$$, $str$$.substr($str$$.length - $suffix$$.length, $suffix$$.length))
};
goog.string.subs = function $goog$string$subs$($str$$, $var_args$$) {
  for(var $i$$ = 1;$i$$ < arguments.length;$i$$++) {
    var $replacement$$ = String(arguments[$i$$]).replace(/\$/g, "$$$$");
    $str$$ = $str$$.replace(/\%s/, $replacement$$)
  }
  return $str$$
};
goog.string.collapseWhitespace = function $goog$string$collapseWhitespace$($str$$) {
  return $str$$.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function $goog$string$isEmpty$($str$$) {
  return/^[\s\xa0]*$/.test($str$$)
};
goog.string.isEmptySafe = function $goog$string$isEmptySafe$($str$$) {
  return goog.string.isEmpty(goog.string.makeSafe($str$$))
};
goog.string.isBreakingWhitespace = function $goog$string$isBreakingWhitespace$($str$$) {
  return!/[^\t\n\r ]/.test($str$$)
};
goog.string.isAlpha = function $goog$string$isAlpha$($str$$) {
  return!/[^a-zA-Z]/.test($str$$)
};
goog.string.isNumeric = function $goog$string$isNumeric$($str$$) {
  return!/[^0-9]/.test($str$$)
};
goog.string.isAlphaNumeric = function $goog$string$isAlphaNumeric$($str$$) {
  return!/[^a-zA-Z0-9]/.test($str$$)
};
goog.string.isSpace = function $goog$string$isSpace$($ch$$) {
  return" " == $ch$$
};
goog.string.isUnicodeChar = function $goog$string$isUnicodeChar$($ch$$) {
  return 1 == $ch$$.length && " " <= $ch$$ && "~" >= $ch$$ || "\u0080" <= $ch$$ && "\ufffd" >= $ch$$
};
goog.string.stripNewlines = function $goog$string$stripNewlines$($str$$) {
  return $str$$.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function $goog$string$canonicalizeNewlines$($str$$) {
  return $str$$.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function $goog$string$normalizeWhitespace$($str$$) {
  return $str$$.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function $goog$string$normalizeSpaces$($str$$) {
  return $str$$.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function $goog$string$collapseBreakingSpaces$($str$$) {
  return $str$$.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function $goog$string$trim$($str$$) {
  return $str$$.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function $goog$string$trimLeft$($str$$) {
  return $str$$.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function $goog$string$trimRight$($str$$) {
  return $str$$.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function $goog$string$caseInsensitiveCompare$($str1$$, $str2$$) {
  var $test1$$ = String($str1$$).toLowerCase(), $test2$$ = String($str2$$).toLowerCase();
  return $test1$$ < $test2$$ ? -1 : $test1$$ == $test2$$ ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function $goog$string$numerateCompare$($str1$$, $str2$$) {
  if($str1$$ == $str2$$) {
    return 0
  }
  if(!$str1$$) {
    return-1
  }
  if(!$str2$$) {
    return 1
  }
  for(var $num1_tokens1$$ = $str1$$.toLowerCase().match(goog.string.numerateCompareRegExp_), $num2_tokens2$$ = $str2$$.toLowerCase().match(goog.string.numerateCompareRegExp_), $count$$ = Math.min($num1_tokens1$$.length, $num2_tokens2$$.length), $i$$ = 0;$i$$ < $count$$;$i$$++) {
    var $a$$ = $num1_tokens1$$[$i$$], $b$$ = $num2_tokens2$$[$i$$];
    if($a$$ != $b$$) {
      return $num1_tokens1$$ = parseInt($a$$, 10), !isNaN($num1_tokens1$$) && ($num2_tokens2$$ = parseInt($b$$, 10), !isNaN($num2_tokens2$$) && $num1_tokens1$$ - $num2_tokens2$$) ? $num1_tokens1$$ - $num2_tokens2$$ : $a$$ < $b$$ ? -1 : 1
    }
  }
  return $num1_tokens1$$.length != $num2_tokens2$$.length ? $num1_tokens1$$.length - $num2_tokens2$$.length : $str1$$ < $str2$$ ? -1 : 1
};
goog.string.urlEncode = function $goog$string$urlEncode$($str$$) {
  return encodeURIComponent(String($str$$))
};
goog.string.urlDecode = function $goog$string$urlDecode$($str$$) {
  return decodeURIComponent($str$$.replace(/\+/g, " "))
};
goog.string.newLineToBr = function $goog$string$newLineToBr$($str$$, $opt_xml$$) {
  return $str$$.replace(/(\r\n|\r|\n)/g, $opt_xml$$ ? "<br />" : "<br>")
};
goog.string.htmlEscape = function $goog$string$htmlEscape$($str$$, $opt_isLikelyToContainHtmlChars$$) {
  if($opt_isLikelyToContainHtmlChars$$) {
    return $str$$.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test($str$$)) {
    return $str$$
  }
  -1 != $str$$.indexOf("&") && ($str$$ = $str$$.replace(goog.string.amperRe_, "&amp;"));
  -1 != $str$$.indexOf("<") && ($str$$ = $str$$.replace(goog.string.ltRe_, "&lt;"));
  -1 != $str$$.indexOf(">") && ($str$$ = $str$$.replace(goog.string.gtRe_, "&gt;"));
  -1 != $str$$.indexOf('"') && ($str$$ = $str$$.replace(goog.string.quotRe_, "&quot;"));
  return $str$$
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function $goog$string$unescapeEntities$($str$$) {
  return goog.string.contains($str$$, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_($str$$) : goog.string.unescapePureXmlEntities_($str$$) : $str$$
};
goog.string.unescapeEntitiesUsingDom_ = function $goog$string$unescapeEntitiesUsingDom_$($str$$) {
  var $seen$$ = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, $div$$ = document.createElement("div");
  return $str$$.replace(goog.string.HTML_ENTITY_PATTERN_, function($s$$, $entity$$) {
    var $value$$ = $seen$$[$s$$];
    if($value$$) {
      return $value$$
    }
    if("#" == $entity$$.charAt(0)) {
      var $n$$ = Number("0" + $entity$$.substr(1));
      isNaN($n$$) || ($value$$ = String.fromCharCode($n$$))
    }
    $value$$ || ($div$$.innerHTML = $s$$ + " ", $value$$ = $div$$.firstChild.nodeValue.slice(0, -1));
    return $seen$$[$s$$] = $value$$
  })
};
goog.string.unescapePureXmlEntities_ = function $goog$string$unescapePureXmlEntities_$($str$$) {
  return $str$$.replace(/&([^;]+);/g, function($s$$, $entity$$) {
    switch($entity$$) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == $entity$$.charAt(0)) {
          var $n$$ = Number("0" + $entity$$.substr(1));
          if(!isNaN($n$$)) {
            return String.fromCharCode($n$$)
          }
        }
        return $s$$
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function $goog$string$whitespaceEscape$($str$$, $opt_xml$$) {
  return goog.string.newLineToBr($str$$.replace(/  /g, " &#160;"), $opt_xml$$)
};
goog.string.stripQuotes = function $goog$string$stripQuotes$($str$$, $quoteChars$$) {
  for(var $length$$ = $quoteChars$$.length, $i$$ = 0;$i$$ < $length$$;$i$$++) {
    var $quoteChar$$ = 1 == $length$$ ? $quoteChars$$ : $quoteChars$$.charAt($i$$);
    if($str$$.charAt(0) == $quoteChar$$ && $str$$.charAt($str$$.length - 1) == $quoteChar$$) {
      return $str$$.substring(1, $str$$.length - 1)
    }
  }
  return $str$$
};
goog.string.truncate = function $goog$string$truncate$($str$$, $chars$$, $opt_protectEscapedCharacters$$) {
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.unescapeEntities($str$$));
  $str$$.length > $chars$$ && ($str$$ = $str$$.substring(0, $chars$$ - 3) + "...");
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.htmlEscape($str$$));
  return $str$$
};
goog.string.truncateMiddle = function $goog$string$truncateMiddle$($str$$, $chars$$, $opt_protectEscapedCharacters$$, $half_opt_trailingChars$$) {
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.unescapeEntities($str$$));
  if($half_opt_trailingChars$$ && $str$$.length > $chars$$) {
    $half_opt_trailingChars$$ > $chars$$ && ($half_opt_trailingChars$$ = $chars$$);
    var $endPoint_endPos$$ = $str$$.length - $half_opt_trailingChars$$;
    $str$$ = $str$$.substring(0, $chars$$ - $half_opt_trailingChars$$) + "..." + $str$$.substring($endPoint_endPos$$)
  }else {
    $str$$.length > $chars$$ && ($half_opt_trailingChars$$ = Math.floor($chars$$ / 2), $endPoint_endPos$$ = $str$$.length - $half_opt_trailingChars$$, $str$$ = $str$$.substring(0, $half_opt_trailingChars$$ + $chars$$ % 2) + "..." + $str$$.substring($endPoint_endPos$$))
  }
  $opt_protectEscapedCharacters$$ && ($str$$ = goog.string.htmlEscape($str$$));
  return $str$$
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function $goog$string$quote$($s$$) {
  $s$$ = String($s$$);
  if($s$$.quote) {
    return $s$$.quote()
  }
  for(var $sb$$ = ['"'], $i$$ = 0;$i$$ < $s$$.length;$i$$++) {
    var $ch$$ = $s$$.charAt($i$$), $cc$$ = $ch$$.charCodeAt(0);
    $sb$$[$i$$ + 1] = goog.string.specialEscapeChars_[$ch$$] || (31 < $cc$$ && 127 > $cc$$ ? $ch$$ : goog.string.escapeChar($ch$$))
  }
  $sb$$.push('"');
  return $sb$$.join("")
};
goog.string.escapeString = function $goog$string$escapeString$($str$$) {
  for(var $sb$$ = [], $i$$ = 0;$i$$ < $str$$.length;$i$$++) {
    $sb$$[$i$$] = goog.string.escapeChar($str$$.charAt($i$$))
  }
  return $sb$$.join("")
};
goog.string.escapeChar = function $goog$string$escapeChar$($c$$) {
  if($c$$ in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[$c$$]
  }
  if($c$$ in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[$c$$] = goog.string.specialEscapeChars_[$c$$]
  }
  var $rv$$ = $c$$, $cc$$ = $c$$.charCodeAt(0);
  if(31 < $cc$$ && 127 > $cc$$) {
    $rv$$ = $c$$
  }else {
    if(256 > $cc$$) {
      if($rv$$ = "\\x", 16 > $cc$$ || 256 < $cc$$) {
        $rv$$ += "0"
      }
    }else {
      $rv$$ = "\\u", 4096 > $cc$$ && ($rv$$ += "0")
    }
    $rv$$ += $cc$$.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[$c$$] = $rv$$
};
goog.string.toMap = function $goog$string$toMap$($s$$) {
  for(var $rv$$ = {}, $i$$ = 0;$i$$ < $s$$.length;$i$$++) {
    $rv$$[$s$$.charAt($i$$)] = !0
  }
  return $rv$$
};
goog.string.contains = function $goog$string$contains$($s$$, $ss$$) {
  return-1 != $s$$.indexOf($ss$$)
};
goog.string.countOf = function $goog$string$countOf$($s$$, $ss$$) {
  return $s$$ && $ss$$ ? $s$$.split($ss$$).length - 1 : 0
};
goog.string.removeAt = function $goog$string$removeAt$($s$$, $index$$, $stringLength$$) {
  var $resultStr$$ = $s$$;
  0 <= $index$$ && ($index$$ < $s$$.length && 0 < $stringLength$$) && ($resultStr$$ = $s$$.substr(0, $index$$) + $s$$.substr($index$$ + $stringLength$$, $s$$.length - $index$$ - $stringLength$$));
  return $resultStr$$
};
goog.string.remove = function $goog$string$remove$($s$$, $ss$$) {
  var $re$$ = RegExp(goog.string.regExpEscape($ss$$), "");
  return $s$$.replace($re$$, "")
};
goog.string.removeAll = function $goog$string$removeAll$($s$$, $ss$$) {
  var $re$$ = RegExp(goog.string.regExpEscape($ss$$), "g");
  return $s$$.replace($re$$, "")
};
goog.string.regExpEscape = function $goog$string$regExpEscape$($s$$) {
  return String($s$$).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function $goog$string$repeat$($string$$, $length$$) {
  return Array($length$$ + 1).join($string$$)
};
goog.string.padNumber = function $goog$string$padNumber$($num$$4_s$$, $length$$, $index$$46_opt_precision$$) {
  $num$$4_s$$ = goog.isDef($index$$46_opt_precision$$) ? $num$$4_s$$.toFixed($index$$46_opt_precision$$) : String($num$$4_s$$);
  $index$$46_opt_precision$$ = $num$$4_s$$.indexOf(".");
  -1 == $index$$46_opt_precision$$ && ($index$$46_opt_precision$$ = $num$$4_s$$.length);
  return goog.string.repeat("0", Math.max(0, $length$$ - $index$$46_opt_precision$$)) + $num$$4_s$$
};
goog.string.makeSafe = function $goog$string$makeSafe$($obj$$) {
  return null == $obj$$ ? "" : String($obj$$)
};
goog.string.buildString = function $goog$string$buildString$($var_args$$) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function $goog$string$getRandomString$() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function $goog$string$compareVersions$($version1$$, $version2$$) {
  for(var $order_v1CompNum$$ = 0, $v1Subs$$ = goog.string.trim(String($version1$$)).split("."), $v2Subs$$ = goog.string.trim(String($version2$$)).split("."), $subCount$$ = Math.max($v1Subs$$.length, $v2Subs$$.length), $subIdx$$ = 0;0 == $order_v1CompNum$$ && $subIdx$$ < $subCount$$;$subIdx$$++) {
    var $v1Sub$$ = $v1Subs$$[$subIdx$$] || "", $v2Sub$$ = $v2Subs$$[$subIdx$$] || "", $v1CompParser$$ = RegExp("(\\d*)(\\D*)", "g"), $v2CompParser$$ = RegExp("(\\d*)(\\D*)", "g");
    do {
      var $v1Comp$$ = $v1CompParser$$.exec($v1Sub$$) || ["", "", ""], $v2Comp$$ = $v2CompParser$$.exec($v2Sub$$) || ["", "", ""];
      if(0 == $v1Comp$$[0].length && 0 == $v2Comp$$[0].length) {
        break
      }
      var $order_v1CompNum$$ = 0 == $v1Comp$$[1].length ? 0 : parseInt($v1Comp$$[1], 10), $v2CompNum$$ = 0 == $v2Comp$$[1].length ? 0 : parseInt($v2Comp$$[1], 10), $order_v1CompNum$$ = goog.string.compareElements_($order_v1CompNum$$, $v2CompNum$$) || goog.string.compareElements_(0 == $v1Comp$$[2].length, 0 == $v2Comp$$[2].length) || goog.string.compareElements_($v1Comp$$[2], $v2Comp$$[2])
    }while(0 == $order_v1CompNum$$)
  }
  return $order_v1CompNum$$
};
goog.string.compareElements_ = function $goog$string$compareElements_$($left$$, $right$$) {
  return $left$$ < $right$$ ? -1 : $left$$ > $right$$ ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function $goog$string$hashCode$($str$$) {
  for(var $result$$ = 0, $i$$ = 0;$i$$ < $str$$.length;++$i$$) {
    $result$$ = 31 * $result$$ + $str$$.charCodeAt($i$$), $result$$ %= goog.string.HASHCODE_MAX_
  }
  return $result$$
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function $goog$string$createUniqueString$() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function $goog$string$toNumber$($str$$) {
  var $num$$ = Number($str$$);
  return 0 == $num$$ && goog.string.isEmpty($str$$) ? NaN : $num$$
};
goog.string.toCamelCase = function $goog$string$toCamelCase$($str$$) {
  return String($str$$).replace(/\-([a-z])/g, function($all$$, $match$$) {
    return $match$$.toUpperCase()
  })
};
goog.string.toSelectorCase = function $goog$string$toSelectorCase$($str$$) {
  return String($str$$).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function $goog$string$toTitleCase$($str$$, $opt_delimiters$$) {
  var $delimiters$$ = goog.isString($opt_delimiters$$) ? goog.string.regExpEscape($opt_delimiters$$) : "\\s";
  return $str$$.replace(RegExp("(^" + ($delimiters$$ ? "|[" + $delimiters$$ + "]+" : "") + ")([a-z])", "g"), function($all$$, $p1$$, $p2$$) {
    return $p1$$ + $p2$$.toUpperCase()
  })
};
goog.string.parseInt = function $goog$string$parseInt$($value$$) {
  isFinite($value$$) && ($value$$ = String($value$$));
  return goog.isString($value$$) ? /^\s*-?0x/i.test($value$$) ? parseInt($value$$, 16) : parseInt($value$$, 10) : NaN
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function $goog$userAgent$getUserAgentString$() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function $goog$userAgent$getNavigator$() {
  return goog.global.navigator
};
goog.userAgent.init_ = function $goog$userAgent$init_$() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var $ua$$;
  if(!goog.userAgent.BROWSER_KNOWN_ && ($ua$$ = goog.userAgent.getUserAgentString())) {
    var $navigator$$ = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == $ua$$.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != $ua$$.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != $ua$$.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != $ua$$.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == $navigator$$.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function $goog$userAgent$determinePlatform_$() {
  var $navigator$$ = goog.userAgent.getNavigator();
  return $navigator$$ && $navigator$$.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function $goog$userAgent$initPlatform_$() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function $goog$userAgent$determineVersion_$() {
  var $arr$$16_operaVersion_version$$ = "", $docMode_re$$;
  goog.userAgent.OPERA && goog.global.opera ? ($arr$$16_operaVersion_version$$ = goog.global.opera.version, $arr$$16_operaVersion_version$$ = "function" == typeof $arr$$16_operaVersion_version$$ ? $arr$$16_operaVersion_version$$() : $arr$$16_operaVersion_version$$) : (goog.userAgent.GECKO ? $docMode_re$$ = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? $docMode_re$$ = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && ($docMode_re$$ = /WebKit\/(\S+)/), $docMode_re$$ && ($arr$$16_operaVersion_version$$ = 
  ($arr$$16_operaVersion_version$$ = $docMode_re$$.exec(goog.userAgent.getUserAgentString())) ? $arr$$16_operaVersion_version$$[1] : ""));
  return goog.userAgent.IE && ($docMode_re$$ = goog.userAgent.getDocumentMode_(), $docMode_re$$ > parseFloat($arr$$16_operaVersion_version$$)) ? String($docMode_re$$) : $arr$$16_operaVersion_version$$
};
goog.userAgent.getDocumentMode_ = function $goog$userAgent$getDocumentMode_$() {
  var $doc$$ = goog.global.document;
  return $doc$$ ? $doc$$.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function $goog$userAgent$compare$($v1$$, $v2$$) {
  return goog.string.compareVersions($v1$$, $v2$$)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function $goog$userAgent$isVersion$($version$$) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[$version$$] || (goog.userAgent.isVersionCache_[$version$$] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, $version$$))
};
goog.userAgent.isDocumentMode = function $goog$userAgent$isDocumentMode$($documentMode$$) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= $documentMode$$
};
goog.userAgent.DOCUMENT_MODE = function() {
  var $doc$$ = goog.global.document;
  return!$doc$$ || !goog.userAgent.IE ? void 0 : goog.userAgent.getDocumentMode_() || ("CSS1Compat" == $doc$$.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5)
}();
goog.events = {};
goog.events.Listener = function $goog$events$Listener$() {
  goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack)
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = !1;
goog.events.Listener.prototype.callOnce = !1;
goog.events.Listener.prototype.init = function $goog$events$Listener$$init$($listener$$, $proxy$$, $src$$, $type$$, $capture$$, $opt_handler$$) {
  if(goog.isFunction($listener$$)) {
    this.isFunctionListener_ = !0
  }else {
    if($listener$$ && $listener$$.handleEvent && goog.isFunction($listener$$.handleEvent)) {
      this.isFunctionListener_ = !1
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = $listener$$;
  this.proxy = $proxy$$;
  this.src = $src$$;
  this.type = $type$$;
  this.capture = !!$capture$$;
  this.handler = $opt_handler$$;
  this.callOnce = !1;
  this.key = ++goog.events.Listener.counter_;
  this.removed = !1
};
goog.events.Listener.prototype.handleEvent = function $goog$events$Listener$$handleEvent$($eventObject$$) {
  return this.isFunctionListener_ ? this.listener.call(this.handler || this.src, $eventObject$$) : this.listener.handleEvent.call(this.listener, $eventObject$$)
};
goog.object = {};
goog.object.forEach = function $goog$object$forEach$($obj$$, $f$$, $opt_obj$$) {
  for(var $key$$ in $obj$$) {
    $f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)
  }
};
goog.object.filter = function $goog$object$filter$($obj$$, $f$$, $opt_obj$$) {
  var $res$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$) && ($res$$[$key$$] = $obj$$[$key$$])
  }
  return $res$$
};
goog.object.map = function $goog$object$map$($obj$$, $f$$, $opt_obj$$) {
  var $res$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$key$$] = $f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)
  }
  return $res$$
};
goog.object.some = function $goog$object$some$($obj$$, $f$$, $opt_obj$$) {
  for(var $key$$ in $obj$$) {
    if($f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function $goog$object$every$($obj$$, $f$$, $opt_obj$$) {
  for(var $key$$ in $obj$$) {
    if(!$f$$.call($opt_obj$$, $obj$$[$key$$], $key$$, $obj$$)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function $goog$object$getCount$($obj$$) {
  var $rv$$ = 0, $key$$;
  for($key$$ in $obj$$) {
    $rv$$++
  }
  return $rv$$
};
goog.object.getAnyKey = function $goog$object$getAnyKey$($obj$$) {
  for(var $key$$ in $obj$$) {
    return $key$$
  }
};
goog.object.getAnyValue = function $goog$object$getAnyValue$($obj$$) {
  for(var $key$$ in $obj$$) {
    return $obj$$[$key$$]
  }
};
goog.object.contains = function $goog$object$contains$($obj$$, $val$$) {
  return goog.object.containsValue($obj$$, $val$$)
};
goog.object.getValues = function $goog$object$getValues$($obj$$) {
  var $res$$ = [], $i$$ = 0, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$i$$++] = $obj$$[$key$$]
  }
  return $res$$
};
goog.object.getKeys = function $goog$object$getKeys$($obj$$) {
  var $res$$ = [], $i$$ = 0, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$i$$++] = $key$$
  }
  return $res$$
};
goog.object.getValueByKeys = function $goog$object$getValueByKeys$($obj$$, $var_args$$) {
  for(var $i$$ = goog.isArrayLike($var_args$$), $keys$$ = $i$$ ? $var_args$$ : arguments, $i$$ = $i$$ ? 0 : 1;$i$$ < $keys$$.length && !($obj$$ = $obj$$[$keys$$[$i$$]], !goog.isDef($obj$$));$i$$++) {
  }
  return $obj$$
};
goog.object.containsKey = function $goog$object$containsKey$($obj$$, $key$$) {
  return $key$$ in $obj$$
};
goog.object.containsValue = function $goog$object$containsValue$($obj$$, $val$$) {
  for(var $key$$ in $obj$$) {
    if($obj$$[$key$$] == $val$$) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function $goog$object$findKey$($obj$$, $f$$, $opt_this$$) {
  for(var $key$$ in $obj$$) {
    if($f$$.call($opt_this$$, $obj$$[$key$$], $key$$, $obj$$)) {
      return $key$$
    }
  }
};
goog.object.findValue = function $goog$object$findValue$($obj$$, $f$$6_key$$, $opt_this$$) {
  return($f$$6_key$$ = goog.object.findKey($obj$$, $f$$6_key$$, $opt_this$$)) && $obj$$[$f$$6_key$$]
};
goog.object.isEmpty = function $goog$object$isEmpty$($obj$$) {
  for(var $key$$ in $obj$$) {
    return!1
  }
  return!0
};
goog.object.clear = function $goog$object$clear$($obj$$) {
  for(var $i$$ in $obj$$) {
    delete $obj$$[$i$$]
  }
};
goog.object.remove = function $goog$object$remove$($obj$$, $key$$) {
  var $rv$$;
  ($rv$$ = $key$$ in $obj$$) && delete $obj$$[$key$$];
  return $rv$$
};
goog.object.add = function $goog$object$add$($obj$$, $key$$, $val$$) {
  if($key$$ in $obj$$) {
    throw Error('The object already contains the key "' + $key$$ + '"');
  }
  goog.object.set($obj$$, $key$$, $val$$)
};
goog.object.get = function $goog$object$get$($obj$$, $key$$, $opt_val$$) {
  return $key$$ in $obj$$ ? $obj$$[$key$$] : $opt_val$$
};
goog.object.set = function $goog$object$set$($obj$$, $key$$, $value$$) {
  $obj$$[$key$$] = $value$$
};
goog.object.setIfUndefined = function $goog$object$setIfUndefined$($obj$$, $key$$, $value$$) {
  return $key$$ in $obj$$ ? $obj$$[$key$$] : $obj$$[$key$$] = $value$$
};
goog.object.clone = function $goog$object$clone$($obj$$) {
  var $res$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $res$$[$key$$] = $obj$$[$key$$]
  }
  return $res$$
};
goog.object.unsafeClone = function $goog$object$unsafeClone$($obj$$) {
  var $clone$$1_type$$ = goog.typeOf($obj$$);
  if("object" == $clone$$1_type$$ || "array" == $clone$$1_type$$) {
    if($obj$$.clone) {
      return $obj$$.clone()
    }
    var $clone$$1_type$$ = "array" == $clone$$1_type$$ ? [] : {}, $key$$;
    for($key$$ in $obj$$) {
      $clone$$1_type$$[$key$$] = goog.object.unsafeClone($obj$$[$key$$])
    }
    return $clone$$1_type$$
  }
  return $obj$$
};
goog.object.transpose = function $goog$object$transpose$($obj$$) {
  var $transposed$$ = {}, $key$$;
  for($key$$ in $obj$$) {
    $transposed$$[$obj$$[$key$$]] = $key$$
  }
  return $transposed$$
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function $goog$object$extend$($target$$, $var_args$$) {
  for(var $key$$, $source$$, $i$$ = 1;$i$$ < arguments.length;$i$$++) {
    $source$$ = arguments[$i$$];
    for($key$$ in $source$$) {
      $target$$[$key$$] = $source$$[$key$$]
    }
    for(var $j$$ = 0;$j$$ < goog.object.PROTOTYPE_FIELDS_.length;$j$$++) {
      $key$$ = goog.object.PROTOTYPE_FIELDS_[$j$$], Object.prototype.hasOwnProperty.call($source$$, $key$$) && ($target$$[$key$$] = $source$$[$key$$])
    }
  }
};
goog.object.create = function $goog$object$create$($var_args$$) {
  var $argLength$$ = arguments.length;
  if(1 == $argLength$$ && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if($argLength$$ % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var $rv$$ = {}, $i$$ = 0;$i$$ < $argLength$$;$i$$ += 2) {
    $rv$$[arguments[$i$$]] = arguments[$i$$ + 1]
  }
  return $rv$$
};
goog.object.createSet = function $goog$object$createSet$($var_args$$) {
  var $argLength$$ = arguments.length;
  if(1 == $argLength$$ && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var $rv$$ = {}, $i$$ = 0;$i$$ < $argLength$$;$i$$++) {
    $rv$$[arguments[$i$$]] = !0
  }
  return $rv$$
};
goog.object.createImmutableView = function $goog$object$createImmutableView$($obj$$) {
  var $result$$ = $obj$$;
  Object.isFrozen && !Object.isFrozen($obj$$) && ($result$$ = Object.create($obj$$), Object.freeze($result$$));
  return $result$$
};
goog.object.isImmutableView = function $goog$object$isImmutableView$($obj$$) {
  return!!Object.isFrozen && Object.isFrozen($obj$$)
};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersion("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersion("1.9b") || goog.userAgent.IE && goog.userAgent.isVersion("8") || goog.userAgent.OPERA && 
goog.userAgent.isVersion("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersion("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersion("8") || goog.userAgent.IE && !goog.userAgent.isVersion("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !(!goog.global.document || !(document.documentElement && "ontouchstart" in document.documentElement)) || !(!goog.global.navigator || !goog.global.navigator.msMaxTouchPoints)};
goog.debug.Error = function $goog$debug$Error$($opt_msg$$) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  $opt_msg$$ && (this.message = String($opt_msg$$))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function $goog$asserts$AssertionError$($messagePattern$$, $messageArgs$$) {
  $messageArgs$$.unshift($messagePattern$$);
  goog.debug.Error.call(this, goog.string.subs.apply(null, $messageArgs$$));
  $messageArgs$$.shift();
  this.messagePattern = $messagePattern$$
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function $goog$asserts$doAssertFailure_$($defaultMessage$$, $defaultArgs$$, $givenMessage$$, $givenArgs$$) {
  var $message$$ = "Assertion failed";
  if($givenMessage$$) {
    var $message$$ = $message$$ + (": " + $givenMessage$$), $args$$ = $givenArgs$$
  }else {
    $defaultMessage$$ && ($message$$ += ": " + $defaultMessage$$, $args$$ = $defaultArgs$$)
  }
  throw new goog.asserts.AssertionError("" + $message$$, $args$$ || []);
};
goog.asserts.assert = function $goog$asserts$assert$($condition$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !$condition$$ && goog.asserts.doAssertFailure_("", null, $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $condition$$
};
goog.asserts.fail = function $goog$asserts$fail$($opt_message$$, $var_args$$) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + ($opt_message$$ ? ": " + $opt_message$$ : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function $goog$asserts$assertNumber$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber($value$$) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertString = function $goog$asserts$assertString$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString($value$$) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertFunction = function $goog$asserts$assertFunction$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction($value$$) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertObject = function $goog$asserts$assertObject$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject($value$$) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertArray = function $goog$asserts$assertArray$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray($value$$) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertBoolean = function $goog$asserts$assertBoolean$($value$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean($value$$) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf($value$$), $value$$], $opt_message$$, Array.prototype.slice.call(arguments, 2));
  return $value$$
};
goog.asserts.assertInstanceof = function $goog$asserts$assertInstanceof$($value$$, $type$$, $opt_message$$, $var_args$$) {
  goog.asserts.ENABLE_ASSERTS && !($value$$ instanceof $type$$) && goog.asserts.doAssertFailure_("instanceof check failed.", null, $opt_message$$, Array.prototype.slice.call(arguments, 3));
  return $value$$
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function $goog$array$peek$($array$$) {
  return $array$$[$array$$.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function($arr$$, $obj$$, $opt_fromIndex$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call($arr$$, $obj$$, $opt_fromIndex$$)
} : function($arr$$, $obj$$, $fromIndex_i$$20_opt_fromIndex$$) {
  $fromIndex_i$$20_opt_fromIndex$$ = null == $fromIndex_i$$20_opt_fromIndex$$ ? 0 : 0 > $fromIndex_i$$20_opt_fromIndex$$ ? Math.max(0, $arr$$.length + $fromIndex_i$$20_opt_fromIndex$$) : $fromIndex_i$$20_opt_fromIndex$$;
  if(goog.isString($arr$$)) {
    return!goog.isString($obj$$) || 1 != $obj$$.length ? -1 : $arr$$.indexOf($obj$$, $fromIndex_i$$20_opt_fromIndex$$)
  }
  for(;$fromIndex_i$$20_opt_fromIndex$$ < $arr$$.length;$fromIndex_i$$20_opt_fromIndex$$++) {
    if($fromIndex_i$$20_opt_fromIndex$$ in $arr$$ && $arr$$[$fromIndex_i$$20_opt_fromIndex$$] === $obj$$) {
      return $fromIndex_i$$20_opt_fromIndex$$
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function($arr$$, $obj$$, $opt_fromIndex$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call($arr$$, $obj$$, null == $opt_fromIndex$$ ? $arr$$.length - 1 : $opt_fromIndex$$)
} : function($arr$$, $obj$$, $fromIndex$$2_i$$21_opt_fromIndex$$) {
  $fromIndex$$2_i$$21_opt_fromIndex$$ = null == $fromIndex$$2_i$$21_opt_fromIndex$$ ? $arr$$.length - 1 : $fromIndex$$2_i$$21_opt_fromIndex$$;
  0 > $fromIndex$$2_i$$21_opt_fromIndex$$ && ($fromIndex$$2_i$$21_opt_fromIndex$$ = Math.max(0, $arr$$.length + $fromIndex$$2_i$$21_opt_fromIndex$$));
  if(goog.isString($arr$$)) {
    return!goog.isString($obj$$) || 1 != $obj$$.length ? -1 : $arr$$.lastIndexOf($obj$$, $fromIndex$$2_i$$21_opt_fromIndex$$)
  }
  for(;0 <= $fromIndex$$2_i$$21_opt_fromIndex$$;$fromIndex$$2_i$$21_opt_fromIndex$$--) {
    if($fromIndex$$2_i$$21_opt_fromIndex$$ in $arr$$ && $arr$$[$fromIndex$$2_i$$21_opt_fromIndex$$] === $obj$$) {
      return $fromIndex$$2_i$$21_opt_fromIndex$$
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    $i$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)
  }
};
goog.array.forEachRight = function $goog$array$forEachRight$($arr$$, $f$$, $opt_obj$$) {
  for(var $i$$23_l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$23_l$$ = $i$$23_l$$ - 1;0 <= $i$$23_l$$;--$i$$23_l$$) {
    $i$$23_l$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$23_l$$], $i$$23_l$$, $arr$$)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $res$$ = [], $resLength$$ = 0, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$) {
      var $val$$ = $arr2$$[$i$$];
      $f$$.call($opt_obj$$, $val$$, $i$$, $arr$$) && ($res$$[$resLength$$++] = $val$$)
    }
  }
  return $res$$
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $res$$ = Array($l$$), $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    $i$$ in $arr2$$ && ($res$$[$i$$] = $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$))
  }
  return $res$$
};
goog.array.reduce = function $goog$array$reduce$($arr$$, $f$$, $val$$0$$, $opt_obj$$) {
  if($arr$$.reduce) {
    return $opt_obj$$ ? $arr$$.reduce(goog.bind($f$$, $opt_obj$$), $val$$0$$) : $arr$$.reduce($f$$, $val$$0$$)
  }
  var $rval$$ = $val$$0$$;
  goog.array.forEach($arr$$, function($val$$, $index$$) {
    $rval$$ = $f$$.call($opt_obj$$, $rval$$, $val$$, $index$$, $arr$$)
  });
  return $rval$$
};
goog.array.reduceRight = function $goog$array$reduceRight$($arr$$, $f$$, $val$$0$$, $opt_obj$$) {
  if($arr$$.reduceRight) {
    return $opt_obj$$ ? $arr$$.reduceRight(goog.bind($f$$, $opt_obj$$), $val$$0$$) : $arr$$.reduceRight($f$$, $val$$0$$)
  }
  var $rval$$ = $val$$0$$;
  goog.array.forEachRight($arr$$, function($val$$, $index$$) {
    $rval$$ = $f$$.call($opt_obj$$, $rval$$, $val$$, $index$$, $arr$$)
  });
  return $rval$$
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function($arr$$, $f$$, $opt_obj$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call($arr$$, $f$$, $opt_obj$$)
} : function($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$ && !$f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)) {
      return!1
    }
  }
  return!0
};
goog.array.count = function $goog$array$count$($arr$$0$$, $f$$, $opt_obj$$) {
  var $count$$ = 0;
  goog.array.forEach($arr$$0$$, function($element$$, $index$$, $arr$$) {
    $f$$.call($opt_obj$$, $element$$, $index$$, $arr$$) && ++$count$$
  }, $opt_obj$$);
  return $count$$
};
goog.array.find = function $goog$array$find$($arr$$, $f$$21_i$$, $opt_obj$$) {
  $f$$21_i$$ = goog.array.findIndex($arr$$, $f$$21_i$$, $opt_obj$$);
  return 0 > $f$$21_i$$ ? null : goog.isString($arr$$) ? $arr$$.charAt($f$$21_i$$) : $arr$$[$f$$21_i$$]
};
goog.array.findIndex = function $goog$array$findIndex$($arr$$, $f$$, $opt_obj$$) {
  for(var $l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if($i$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$], $i$$, $arr$$)) {
      return $i$$
    }
  }
  return-1
};
goog.array.findRight = function $goog$array$findRight$($arr$$, $f$$23_i$$, $opt_obj$$) {
  $f$$23_i$$ = goog.array.findIndexRight($arr$$, $f$$23_i$$, $opt_obj$$);
  return 0 > $f$$23_i$$ ? null : goog.isString($arr$$) ? $arr$$.charAt($f$$23_i$$) : $arr$$[$f$$23_i$$]
};
goog.array.findIndexRight = function $goog$array$findIndexRight$($arr$$, $f$$, $opt_obj$$) {
  for(var $i$$31_l$$ = $arr$$.length, $arr2$$ = goog.isString($arr$$) ? $arr$$.split("") : $arr$$, $i$$31_l$$ = $i$$31_l$$ - 1;0 <= $i$$31_l$$;$i$$31_l$$--) {
    if($i$$31_l$$ in $arr2$$ && $f$$.call($opt_obj$$, $arr2$$[$i$$31_l$$], $i$$31_l$$, $arr$$)) {
      return $i$$31_l$$
    }
  }
  return-1
};
goog.array.contains = function $goog$array$contains$($arr$$, $obj$$) {
  return 0 <= goog.array.indexOf($arr$$, $obj$$)
};
goog.array.isEmpty = function $goog$array$isEmpty$($arr$$) {
  return 0 == $arr$$.length
};
goog.array.clear = function $goog$array$clear$($arr$$) {
  if(!goog.isArray($arr$$)) {
    for(var $i$$ = $arr$$.length - 1;0 <= $i$$;$i$$--) {
      delete $arr$$[$i$$]
    }
  }
  $arr$$.length = 0
};
goog.array.insert = function $goog$array$insert$($arr$$, $obj$$) {
  goog.array.contains($arr$$, $obj$$) || $arr$$.push($obj$$)
};
goog.array.insertAt = function $goog$array$insertAt$($arr$$, $obj$$, $opt_i$$) {
  goog.array.splice($arr$$, $opt_i$$, 0, $obj$$)
};
goog.array.insertArrayAt = function $goog$array$insertArrayAt$($arr$$, $elementsToAdd$$, $opt_i$$) {
  goog.partial(goog.array.splice, $arr$$, $opt_i$$, 0).apply(null, $elementsToAdd$$)
};
goog.array.insertBefore = function $goog$array$insertBefore$($arr$$, $obj$$, $opt_obj2$$) {
  var $i$$;
  2 == arguments.length || 0 > ($i$$ = goog.array.indexOf($arr$$, $opt_obj2$$)) ? $arr$$.push($obj$$) : goog.array.insertAt($arr$$, $obj$$, $i$$)
};
goog.array.remove = function $goog$array$remove$($arr$$, $obj$$) {
  var $i$$ = goog.array.indexOf($arr$$, $obj$$), $rv$$;
  ($rv$$ = 0 <= $i$$) && goog.array.removeAt($arr$$, $i$$);
  return $rv$$
};
goog.array.removeAt = function $goog$array$removeAt$($arr$$, $i$$) {
  goog.asserts.assert(null != $arr$$.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call($arr$$, $i$$, 1).length
};
goog.array.removeIf = function $goog$array$removeIf$($arr$$, $f$$25_i$$, $opt_obj$$) {
  $f$$25_i$$ = goog.array.findIndex($arr$$, $f$$25_i$$, $opt_obj$$);
  return 0 <= $f$$25_i$$ ? (goog.array.removeAt($arr$$, $f$$25_i$$), !0) : !1
};
goog.array.concat = function $goog$array$concat$($var_args$$) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function $goog$array$toArray$($object$$) {
  var $length$$ = $object$$.length;
  if(0 < $length$$) {
    for(var $rv$$ = Array($length$$), $i$$ = 0;$i$$ < $length$$;$i$$++) {
      $rv$$[$i$$] = $object$$[$i$$]
    }
    return $rv$$
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function $goog$array$extend$($arr1$$, $var_args$$) {
  for(var $i$$ = 1;$i$$ < arguments.length;$i$$++) {
    var $arr2$$ = arguments[$i$$], $isArrayLike$$;
    if(goog.isArray($arr2$$) || ($isArrayLike$$ = goog.isArrayLike($arr2$$)) && Object.prototype.hasOwnProperty.call($arr2$$, "callee")) {
      $arr1$$.push.apply($arr1$$, $arr2$$)
    }else {
      if($isArrayLike$$) {
        for(var $len1$$ = $arr1$$.length, $len2$$ = $arr2$$.length, $j$$ = 0;$j$$ < $len2$$;$j$$++) {
          $arr1$$[$len1$$ + $j$$] = $arr2$$[$j$$]
        }
      }else {
        $arr1$$.push($arr2$$)
      }
    }
  }
};
goog.array.splice = function $goog$array$splice$($arr$$, $index$$, $howMany$$, $var_args$$) {
  goog.asserts.assert(null != $arr$$.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply($arr$$, goog.array.slice(arguments, 1))
};
goog.array.slice = function $goog$array$slice$($arr$$, $start$$, $opt_end$$) {
  goog.asserts.assert(null != $arr$$.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call($arr$$, $start$$) : goog.array.ARRAY_PROTOTYPE_.slice.call($arr$$, $start$$, $opt_end$$)
};
goog.array.removeDuplicates = function $goog$array$removeDuplicates$($arr$$, $opt_rv$$) {
  for(var $returnArray$$ = $opt_rv$$ || $arr$$, $seen$$ = {}, $cursorInsert$$ = 0, $cursorRead$$ = 0;$cursorRead$$ < $arr$$.length;) {
    var $current$$ = $arr$$[$cursorRead$$++], $key$$ = goog.isObject($current$$) ? "o" + goog.getUid($current$$) : (typeof $current$$).charAt(0) + $current$$;
    Object.prototype.hasOwnProperty.call($seen$$, $key$$) || ($seen$$[$key$$] = !0, $returnArray$$[$cursorInsert$$++] = $current$$)
  }
  $returnArray$$.length = $cursorInsert$$
};
goog.array.binarySearch = function $goog$array$binarySearch$($arr$$, $target$$, $opt_compareFn$$) {
  return goog.array.binarySearch_($arr$$, $opt_compareFn$$ || goog.array.defaultCompare, !1, $target$$)
};
goog.array.binarySelect = function $goog$array$binarySelect$($arr$$, $evaluator$$, $opt_obj$$) {
  return goog.array.binarySearch_($arr$$, $evaluator$$, !0, void 0, $opt_obj$$)
};
goog.array.binarySearch_ = function $goog$array$binarySearch_$($arr$$, $compareFn$$, $isEvaluator$$, $opt_target$$, $opt_selfObj$$) {
  for(var $left$$ = 0, $right$$ = $arr$$.length, $found$$;$left$$ < $right$$;) {
    var $middle$$ = $left$$ + $right$$ >> 1, $compareResult$$;
    $compareResult$$ = $isEvaluator$$ ? $compareFn$$.call($opt_selfObj$$, $arr$$[$middle$$], $middle$$, $arr$$) : $compareFn$$($opt_target$$, $arr$$[$middle$$]);
    0 < $compareResult$$ ? $left$$ = $middle$$ + 1 : ($right$$ = $middle$$, $found$$ = !$compareResult$$)
  }
  return $found$$ ? $left$$ : ~$left$$
};
goog.array.sort = function $goog$array$sort$($arr$$, $opt_compareFn$$) {
  goog.asserts.assert(null != $arr$$.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call($arr$$, $opt_compareFn$$ || goog.array.defaultCompare)
};
goog.array.stableSort = function $goog$array$stableSort$($arr$$, $opt_compareFn$$) {
  for(var $i$$ = 0;$i$$ < $arr$$.length;$i$$++) {
    $arr$$[$i$$] = {index:$i$$, value:$arr$$[$i$$]}
  }
  var $valueCompareFn$$ = $opt_compareFn$$ || goog.array.defaultCompare;
  goog.array.sort($arr$$, function stableCompareFn($obj1$$, $obj2$$) {
    return $valueCompareFn$$($obj1$$.value, $obj2$$.value) || $obj1$$.index - $obj2$$.index
  });
  for($i$$ = 0;$i$$ < $arr$$.length;$i$$++) {
    $arr$$[$i$$] = $arr$$[$i$$].value
  }
};
goog.array.sortObjectsByKey = function $goog$array$sortObjectsByKey$($arr$$, $key$$, $opt_compareFn$$) {
  var $compare$$ = $opt_compareFn$$ || goog.array.defaultCompare;
  goog.array.sort($arr$$, function($a$$, $b$$) {
    return $compare$$($a$$[$key$$], $b$$[$key$$])
  })
};
goog.array.isSorted = function $goog$array$isSorted$($arr$$, $compare$$1_opt_compareFn$$, $opt_strict$$) {
  $compare$$1_opt_compareFn$$ = $compare$$1_opt_compareFn$$ || goog.array.defaultCompare;
  for(var $i$$ = 1;$i$$ < $arr$$.length;$i$$++) {
    var $compareResult$$ = $compare$$1_opt_compareFn$$($arr$$[$i$$ - 1], $arr$$[$i$$]);
    if(0 < $compareResult$$ || 0 == $compareResult$$ && $opt_strict$$) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function $goog$array$equals$($arr1$$, $arr2$$, $equalsFn_opt_equalsFn$$) {
  if(!goog.isArrayLike($arr1$$) || !goog.isArrayLike($arr2$$) || $arr1$$.length != $arr2$$.length) {
    return!1
  }
  var $l$$ = $arr1$$.length;
  $equalsFn_opt_equalsFn$$ = $equalsFn_opt_equalsFn$$ || goog.array.defaultCompareEquality;
  for(var $i$$ = 0;$i$$ < $l$$;$i$$++) {
    if(!$equalsFn_opt_equalsFn$$($arr1$$[$i$$], $arr2$$[$i$$])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function $goog$array$compare$($arr1$$, $arr2$$, $opt_equalsFn$$) {
  return goog.array.equals($arr1$$, $arr2$$, $opt_equalsFn$$)
};
goog.array.compare3 = function $goog$array$compare3$($arr1$$, $arr2$$, $compare$$2_opt_compareFn$$) {
  $compare$$2_opt_compareFn$$ = $compare$$2_opt_compareFn$$ || goog.array.defaultCompare;
  for(var $l$$ = Math.min($arr1$$.length, $arr2$$.length), $i$$ = 0;$i$$ < $l$$;$i$$++) {
    var $result$$ = $compare$$2_opt_compareFn$$($arr1$$[$i$$], $arr2$$[$i$$]);
    if(0 != $result$$) {
      return $result$$
    }
  }
  return goog.array.defaultCompare($arr1$$.length, $arr2$$.length)
};
goog.array.defaultCompare = function $goog$array$defaultCompare$($a$$, $b$$) {
  return $a$$ > $b$$ ? 1 : $a$$ < $b$$ ? -1 : 0
};
goog.array.defaultCompareEquality = function $goog$array$defaultCompareEquality$($a$$, $b$$) {
  return $a$$ === $b$$
};
goog.array.binaryInsert = function $goog$array$binaryInsert$($array$$, $value$$, $index$$51_opt_compareFn$$) {
  $index$$51_opt_compareFn$$ = goog.array.binarySearch($array$$, $value$$, $index$$51_opt_compareFn$$);
  return 0 > $index$$51_opt_compareFn$$ ? (goog.array.insertAt($array$$, $value$$, -($index$$51_opt_compareFn$$ + 1)), !0) : !1
};
goog.array.binaryRemove = function $goog$array$binaryRemove$($array$$, $index$$52_value$$, $opt_compareFn$$) {
  $index$$52_value$$ = goog.array.binarySearch($array$$, $index$$52_value$$, $opt_compareFn$$);
  return 0 <= $index$$52_value$$ ? goog.array.removeAt($array$$, $index$$52_value$$) : !1
};
goog.array.bucket = function $goog$array$bucket$($array$$, $sorter$$) {
  for(var $buckets$$ = {}, $i$$ = 0;$i$$ < $array$$.length;$i$$++) {
    var $value$$ = $array$$[$i$$], $key$$ = $sorter$$($value$$, $i$$, $array$$);
    goog.isDef($key$$) && ($buckets$$[$key$$] || ($buckets$$[$key$$] = [])).push($value$$)
  }
  return $buckets$$
};
goog.array.toObject = function $goog$array$toObject$($arr$$, $keyFunc$$, $opt_obj$$) {
  var $ret$$ = {};
  goog.array.forEach($arr$$, function($element$$, $index$$) {
    $ret$$[$keyFunc$$.call($opt_obj$$, $element$$, $index$$, $arr$$)] = $element$$
  });
  return $ret$$
};
goog.array.repeat = function $goog$array$repeat$($value$$, $n$$) {
  for(var $array$$ = [], $i$$ = 0;$i$$ < $n$$;$i$$++) {
    $array$$[$i$$] = $value$$
  }
  return $array$$
};
goog.array.flatten = function $goog$array$flatten$($var_args$$) {
  for(var $result$$ = [], $i$$ = 0;$i$$ < arguments.length;$i$$++) {
    var $element$$ = arguments[$i$$];
    goog.isArray($element$$) ? $result$$.push.apply($result$$, goog.array.flatten.apply(null, $element$$)) : $result$$.push($element$$)
  }
  return $result$$
};
goog.array.rotate = function $goog$array$rotate$($array$$, $n$$) {
  goog.asserts.assert(null != $array$$.length);
  $array$$.length && ($n$$ %= $array$$.length, 0 < $n$$ ? goog.array.ARRAY_PROTOTYPE_.unshift.apply($array$$, $array$$.splice(-$n$$, $n$$)) : 0 > $n$$ && goog.array.ARRAY_PROTOTYPE_.push.apply($array$$, $array$$.splice(0, -$n$$)));
  return $array$$
};
goog.array.zip = function $goog$array$zip$($var_args$$) {
  if(!arguments.length) {
    return[]
  }
  for(var $result$$ = [], $i$$ = 0;;$i$$++) {
    for(var $value$$ = [], $j$$ = 0;$j$$ < arguments.length;$j$$++) {
      var $arr$$ = arguments[$j$$];
      if($i$$ >= $arr$$.length) {
        return $result$$
      }
      $value$$.push($arr$$[$i$$])
    }
    $result$$.push($value$$)
  }
};
goog.array.shuffle = function $goog$array$shuffle$($arr$$, $opt_randFn$$) {
  for(var $randFn$$ = $opt_randFn$$ || Math.random, $i$$ = $arr$$.length - 1;0 < $i$$;$i$$--) {
    var $j$$ = Math.floor($randFn$$() * ($i$$ + 1)), $tmp$$ = $arr$$[$i$$];
    $arr$$[$i$$] = $arr$$[$j$$];
    $arr$$[$j$$] = $tmp$$
  }
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function $goog$debug$EntryPointMonitor$() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function $goog$debug$entryPointRegistry$register$($callback$$) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = $callback$$;
  if(goog.debug.entryPointRegistry.monitorsMayExist_) {
    for(var $monitors$$ = goog.debug.entryPointRegistry.monitors_, $i$$ = 0;$i$$ < $monitors$$.length;$i$$++) {
      $callback$$(goog.bind($monitors$$[$i$$].wrap, $monitors$$[$i$$]))
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function $goog$debug$entryPointRegistry$monitorAll$($monitor$$) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for(var $transformer$$ = goog.bind($monitor$$.wrap, $monitor$$), $i$$ = 0;$i$$ < goog.debug.entryPointRegistry.refList_.length;$i$$++) {
    goog.debug.entryPointRegistry.refList_[$i$$]($transformer$$)
  }
  goog.debug.entryPointRegistry.monitors_.push($monitor$$)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function $goog$debug$entryPointRegistry$unmonitorAllIfPossible$($monitor$$1_transformer$$) {
  var $monitors$$ = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert($monitor$$1_transformer$$ == $monitors$$[$monitors$$.length - 1], "Only the most recent monitor can be unwrapped.");
  $monitor$$1_transformer$$ = goog.bind($monitor$$1_transformer$$.unwrap, $monitor$$1_transformer$$);
  for(var $i$$ = 0;$i$$ < goog.debug.entryPointRegistry.refList_.length;$i$$++) {
    goog.debug.entryPointRegistry.refList_[$i$$]($monitor$$1_transformer$$)
  }
  $monitors$$.length--
};
goog.events.EventWrapper = function $goog$events$EventWrapper$() {
};
goog.events.EventWrapper.prototype.listen = function $goog$events$EventWrapper$$listen$() {
};
goog.events.EventWrapper.prototype.unlisten = function $goog$events$EventWrapper$$unlisten$() {
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", 
POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", TRANSITIONEND:goog.userAgent.WEBKIT ? "webkitTransitionEnd" : goog.userAgent.OPERA ? "oTransitionEnd" : "transitionend", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", 
MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROVER:"MSPointerOver", MSPOINTEROUT:"MSPointerOut", MSPOINTERUP:"MSPointerUp"};
goog.disposable = {};
goog.disposable.IDisposable = function $goog$disposable$IDisposable$() {
};
goog.Disposable = function $goog$Disposable$() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (this.creationStack = Error().stack, goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function $goog$Disposable$getUndisposedObjects$() {
  var $ret$$ = [], $id$$;
  for($id$$ in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty($id$$) && $ret$$.push(goog.Disposable.instances_[Number($id$$)])
  }
  return $ret$$
};
goog.Disposable.clearUndisposedObjects = function $goog$Disposable$clearUndisposedObjects$() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function $goog$Disposable$$isDisposed$() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function $goog$Disposable$$dispose$() {
  if(!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var $uid$$ = goog.getUid(this);
    if(goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty($uid$$)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[$uid$$]
  }
};
goog.Disposable.prototype.registerDisposable = function $goog$Disposable$$registerDisposable$($disposable$$) {
  this.dependentDisposables_ || (this.dependentDisposables_ = []);
  this.dependentDisposables_.push($disposable$$)
};
goog.Disposable.prototype.addOnDisposeCallback = function $goog$Disposable$$addOnDisposeCallback$($callback$$, $opt_scope$$) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.bind($callback$$, $opt_scope$$))
};
goog.Disposable.prototype.disposeInternal = function $goog$Disposable$$disposeInternal$() {
  this.dependentDisposables_ && goog.disposeAll.apply(null, this.dependentDisposables_);
  if(this.onDisposeCallbacks_) {
    for(;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()()
    }
  }
};
goog.Disposable.isDisposed = function $goog$Disposable$isDisposed$($obj$$) {
  return $obj$$ && "function" == typeof $obj$$.isDisposed ? $obj$$.isDisposed() : !1
};
goog.dispose = function $goog$dispose$($obj$$) {
  $obj$$ && "function" == typeof $obj$$.dispose && $obj$$.dispose()
};
goog.disposeAll = function $goog$disposeAll$($var_args$$) {
  for(var $i$$ = 0, $len$$ = arguments.length;$i$$ < $len$$;++$i$$) {
    var $disposable$$ = arguments[$i$$];
    goog.isArrayLike($disposable$$) ? goog.disposeAll.apply(null, $disposable$$) : goog.dispose($disposable$$)
  }
};
goog.events.Event = function $goog$events$Event$($type$$, $opt_target$$) {
  this.type = $type$$;
  this.currentTarget = this.target = $opt_target$$
};
goog.events.Event.prototype.disposeInternal = function $goog$events$Event$$disposeInternal$() {
};
goog.events.Event.prototype.dispose = function $goog$events$Event$$dispose$() {
};
goog.events.Event.prototype.propagationStopped_ = !1;
goog.events.Event.prototype.defaultPrevented = !1;
goog.events.Event.prototype.returnValue_ = !0;
goog.events.Event.prototype.stopPropagation = function $goog$events$Event$$stopPropagation$() {
  this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function $goog$events$Event$$preventDefault$() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function $goog$events$Event$stopPropagation$($e$$) {
  $e$$.stopPropagation()
};
goog.events.Event.preventDefault = function $goog$events$Event$preventDefault$($e$$) {
  $e$$.preventDefault()
};
goog.reflect = {};
goog.reflect.object = function $goog$reflect$object$($type$$, $object$$) {
  return $object$$
};
goog.reflect.sinkValue = function $goog$reflect$sinkValue$($x$$) {
  goog.reflect.sinkValue[" "]($x$$);
  return $x$$
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function $goog$reflect$canAccessProperty$($obj$$, $prop$$) {
  try {
    return goog.reflect.sinkValue($obj$$[$prop$$]), !0
  }catch($e$$) {
  }
  return!1
};
goog.events.BrowserEvent = function $goog$events$BrowserEvent$($opt_e$$, $opt_currentTarget$$) {
  $opt_e$$ && this.init($opt_e$$, $opt_currentTarget$$)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = !1;
goog.events.BrowserEvent.prototype.altKey = !1;
goog.events.BrowserEvent.prototype.shiftKey = !1;
goog.events.BrowserEvent.prototype.metaKey = !1;
goog.events.BrowserEvent.prototype.platformModifierKey = !1;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function $goog$events$BrowserEvent$$init$($e$$, $opt_currentTarget$$) {
  var $type$$ = this.type = $e$$.type;
  goog.events.Event.call(this, $type$$);
  this.target = $e$$.target || $e$$.srcElement;
  this.currentTarget = $opt_currentTarget$$;
  var $relatedTarget$$ = $e$$.relatedTarget;
  $relatedTarget$$ ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty($relatedTarget$$, "nodeName") || ($relatedTarget$$ = null)) : $type$$ == goog.events.EventType.MOUSEOVER ? $relatedTarget$$ = $e$$.fromElement : $type$$ == goog.events.EventType.MOUSEOUT && ($relatedTarget$$ = $e$$.toElement);
  this.relatedTarget = $relatedTarget$$;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== $e$$.offsetX ? $e$$.offsetX : $e$$.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== $e$$.offsetY ? $e$$.offsetY : $e$$.layerY;
  this.clientX = void 0 !== $e$$.clientX ? $e$$.clientX : $e$$.pageX;
  this.clientY = void 0 !== $e$$.clientY ? $e$$.clientY : $e$$.pageY;
  this.screenX = $e$$.screenX || 0;
  this.screenY = $e$$.screenY || 0;
  this.button = $e$$.button;
  this.keyCode = $e$$.keyCode || 0;
  this.charCode = $e$$.charCode || ("keypress" == $type$$ ? $e$$.keyCode : 0);
  this.ctrlKey = $e$$.ctrlKey;
  this.altKey = $e$$.altKey;
  this.shiftKey = $e$$.shiftKey;
  this.metaKey = $e$$.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? $e$$.metaKey : $e$$.ctrlKey;
  this.state = $e$$.state;
  this.event_ = $e$$;
  $e$$.defaultPrevented && this.preventDefault();
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function $goog$events$BrowserEvent$$isButton$($button$$) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == $button$$ : "click" == this.type ? $button$$ == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[$button$$])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function $goog$events$BrowserEvent$$isMouseActionButton$() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function $goog$events$BrowserEvent$$stopPropagation$() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function $goog$events$BrowserEvent$$preventDefault$() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var $be$$ = this.event_;
  if($be$$.preventDefault) {
    $be$$.preventDefault()
  }else {
    if($be$$.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if($be$$.ctrlKey || 112 <= $be$$.keyCode && 123 >= $be$$.keyCode) {
          $be$$.keyCode = -1
        }
      }catch($ex$$) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function $goog$events$BrowserEvent$$getBrowserEvent$() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function $goog$events$BrowserEvent$$disposeInternal$() {
};
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function $goog$events$listen$($src$$, $type$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  if(goog.isArray($type$$)) {
    for(var $i$$ = 0;$i$$ < $type$$.length;$i$$++) {
      goog.events.listen($src$$, $type$$[$i$$], $listener$$, $opt_capt$$, $opt_handler$$)
    }
    return null
  }
  return goog.events.listen_($src$$, $type$$, $listener$$, !1, $opt_capt$$, $opt_handler$$)
};
goog.events.listen_ = function $goog$events$listen_$($src$$, $type$$, $key$$45_listener$$, $callOnce$$, $capture$$1_opt_capt$$, $opt_handler$$) {
  if(!$type$$) {
    throw Error("Invalid event type");
  }
  $capture$$1_opt_capt$$ = !!$capture$$1_opt_capt$$;
  var $listenerObj_map$$ = goog.events.listenerTree_;
  $type$$ in $listenerObj_map$$ || ($listenerObj_map$$[$type$$] = {count_:0, remaining_:0});
  $listenerObj_map$$ = $listenerObj_map$$[$type$$];
  $capture$$1_opt_capt$$ in $listenerObj_map$$ || ($listenerObj_map$$[$capture$$1_opt_capt$$] = {count_:0, remaining_:0}, $listenerObj_map$$.count_++);
  var $listenerObj_map$$ = $listenerObj_map$$[$capture$$1_opt_capt$$], $srcUid$$ = goog.getUid($src$$), $listenerArray$$;
  $listenerObj_map$$.remaining_++;
  if($listenerObj_map$$[$srcUid$$]) {
    $listenerArray$$ = $listenerObj_map$$[$srcUid$$];
    for(var $i$$53_proxy$$ = 0;$i$$53_proxy$$ < $listenerArray$$.length;$i$$53_proxy$$++) {
      if($listenerObj_map$$ = $listenerArray$$[$i$$53_proxy$$], $listenerObj_map$$.listener == $key$$45_listener$$ && $listenerObj_map$$.handler == $opt_handler$$) {
        if($listenerObj_map$$.removed) {
          break
        }
        $callOnce$$ || ($listenerArray$$[$i$$53_proxy$$].callOnce = !1);
        return $listenerArray$$[$i$$53_proxy$$].key
      }
    }
  }else {
    $listenerArray$$ = $listenerObj_map$$[$srcUid$$] = [], $listenerObj_map$$.count_++
  }
  $i$$53_proxy$$ = goog.events.getProxy();
  $i$$53_proxy$$.src = $src$$;
  $listenerObj_map$$ = new goog.events.Listener;
  $listenerObj_map$$.init($key$$45_listener$$, $i$$53_proxy$$, $src$$, $type$$, $capture$$1_opt_capt$$, $opt_handler$$);
  $listenerObj_map$$.callOnce = $callOnce$$;
  $key$$45_listener$$ = $listenerObj_map$$.key;
  $i$$53_proxy$$.key = $key$$45_listener$$;
  $listenerArray$$.push($listenerObj_map$$);
  goog.events.listeners_[$key$$45_listener$$] = $listenerObj_map$$;
  goog.events.sources_[$srcUid$$] || (goog.events.sources_[$srcUid$$] = []);
  goog.events.sources_[$srcUid$$].push($listenerObj_map$$);
  $src$$.addEventListener ? ($src$$ == goog.global || !$src$$.customEvent_) && $src$$.addEventListener($type$$, $i$$53_proxy$$, $capture$$1_opt_capt$$) : $src$$.attachEvent(goog.events.getOnString_($type$$), $i$$53_proxy$$);
  return $key$$45_listener$$
};
goog.events.getProxy = function $goog$events$getProxy$() {
  var $proxyCallbackFunction$$ = goog.events.handleBrowserEvent_, $f$$ = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function($eventObject$$) {
    return $proxyCallbackFunction$$.call($f$$.src, $f$$.key, $eventObject$$)
  } : function($eventObject$$) {
    $eventObject$$ = $proxyCallbackFunction$$.call($f$$.src, $f$$.key, $eventObject$$);
    if(!$eventObject$$) {
      return $eventObject$$
    }
  };
  return $f$$
};
goog.events.listenOnce = function $goog$events$listenOnce$($src$$, $type$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  if(goog.isArray($type$$)) {
    for(var $i$$ = 0;$i$$ < $type$$.length;$i$$++) {
      goog.events.listenOnce($src$$, $type$$[$i$$], $listener$$, $opt_capt$$, $opt_handler$$)
    }
    return null
  }
  return goog.events.listen_($src$$, $type$$, $listener$$, !0, $opt_capt$$, $opt_handler$$)
};
goog.events.listenWithWrapper = function $goog$events$listenWithWrapper$($src$$, $wrapper$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  $wrapper$$.listen($src$$, $listener$$, $opt_capt$$, $opt_handler$$)
};
goog.events.unlisten = function $goog$events$unlisten$($listenerArray$$1_src$$, $type$$, $listener$$, $capture$$2_opt_capt$$, $opt_handler$$) {
  if(goog.isArray($type$$)) {
    for(var $i$$ = 0;$i$$ < $type$$.length;$i$$++) {
      goog.events.unlisten($listenerArray$$1_src$$, $type$$[$i$$], $listener$$, $capture$$2_opt_capt$$, $opt_handler$$)
    }
    return null
  }
  $capture$$2_opt_capt$$ = !!$capture$$2_opt_capt$$;
  $listenerArray$$1_src$$ = goog.events.getListeners_($listenerArray$$1_src$$, $type$$, $capture$$2_opt_capt$$);
  if(!$listenerArray$$1_src$$) {
    return!1
  }
  for($i$$ = 0;$i$$ < $listenerArray$$1_src$$.length;$i$$++) {
    if($listenerArray$$1_src$$[$i$$].listener == $listener$$ && $listenerArray$$1_src$$[$i$$].capture == $capture$$2_opt_capt$$ && $listenerArray$$1_src$$[$i$$].handler == $opt_handler$$) {
      return goog.events.unlistenByKey($listenerArray$$1_src$$[$i$$].key)
    }
  }
  return!1
};
goog.events.unlistenByKey = function $goog$events$unlistenByKey$($key$$) {
  if(!goog.events.listeners_[$key$$]) {
    return!1
  }
  var $listener$$40_listenerArray$$ = goog.events.listeners_[$key$$];
  if($listener$$40_listenerArray$$.removed) {
    return!1
  }
  var $src$$12_srcUid$$ = $listener$$40_listenerArray$$.src, $type$$ = $listener$$40_listenerArray$$.type, $proxy$$ = $listener$$40_listenerArray$$.proxy, $capture$$ = $listener$$40_listenerArray$$.capture;
  $src$$12_srcUid$$.removeEventListener ? ($src$$12_srcUid$$ == goog.global || !$src$$12_srcUid$$.customEvent_) && $src$$12_srcUid$$.removeEventListener($type$$, $proxy$$, $capture$$) : $src$$12_srcUid$$.detachEvent && $src$$12_srcUid$$.detachEvent(goog.events.getOnString_($type$$), $proxy$$);
  $src$$12_srcUid$$ = goog.getUid($src$$12_srcUid$$);
  goog.events.sources_[$src$$12_srcUid$$] && ($proxy$$ = goog.events.sources_[$src$$12_srcUid$$], goog.array.remove($proxy$$, $listener$$40_listenerArray$$), 0 == $proxy$$.length && delete goog.events.sources_[$src$$12_srcUid$$]);
  $listener$$40_listenerArray$$.removed = !0;
  if($listener$$40_listenerArray$$ = goog.events.listenerTree_[$type$$][$capture$$][$src$$12_srcUid$$]) {
    $listener$$40_listenerArray$$.needsCleanup_ = !0, goog.events.cleanUp_($type$$, $capture$$, $src$$12_srcUid$$, $listener$$40_listenerArray$$)
  }
  delete goog.events.listeners_[$key$$];
  return!0
};
goog.events.unlistenWithWrapper = function $goog$events$unlistenWithWrapper$($src$$, $wrapper$$, $listener$$, $opt_capt$$, $opt_handler$$) {
  $wrapper$$.unlisten($src$$, $listener$$, $opt_capt$$, $opt_handler$$)
};
goog.events.cleanUp_ = function $goog$events$cleanUp_$($type$$, $capture$$, $srcUid$$, $listenerArray$$) {
  if(!$listenerArray$$.locked_ && $listenerArray$$.needsCleanup_) {
    for(var $oldIndex$$ = 0, $newIndex$$ = 0;$oldIndex$$ < $listenerArray$$.length;$oldIndex$$++) {
      $listenerArray$$[$oldIndex$$].removed ? $listenerArray$$[$oldIndex$$].proxy.src = null : ($oldIndex$$ != $newIndex$$ && ($listenerArray$$[$newIndex$$] = $listenerArray$$[$oldIndex$$]), $newIndex$$++)
    }
    $listenerArray$$.length = $newIndex$$;
    $listenerArray$$.needsCleanup_ = !1;
    0 == $newIndex$$ && (delete goog.events.listenerTree_[$type$$][$capture$$][$srcUid$$], goog.events.listenerTree_[$type$$][$capture$$].count_--, 0 == goog.events.listenerTree_[$type$$][$capture$$].count_ && (delete goog.events.listenerTree_[$type$$][$capture$$], goog.events.listenerTree_[$type$$].count_--), 0 == goog.events.listenerTree_[$type$$].count_ && delete goog.events.listenerTree_[$type$$])
  }
};
goog.events.removeAll = function $goog$events$removeAll$($opt_obj$$27_sourcesArray$$1_srcUid$$, $opt_type$$, $opt_capt$$) {
  var $count$$ = 0, $noType$$ = null == $opt_type$$, $noCapt$$ = null == $opt_capt$$;
  $opt_capt$$ = !!$opt_capt$$;
  if(null == $opt_obj$$27_sourcesArray$$1_srcUid$$) {
    goog.object.forEach(goog.events.sources_, function($listeners$$) {
      for(var $i$$ = $listeners$$.length - 1;0 <= $i$$;$i$$--) {
        var $listener$$ = $listeners$$[$i$$];
        if(($noType$$ || $opt_type$$ == $listener$$.type) && ($noCapt$$ || $opt_capt$$ == $listener$$.capture)) {
          goog.events.unlistenByKey($listener$$.key), $count$$++
        }
      }
    })
  }else {
    if($opt_obj$$27_sourcesArray$$1_srcUid$$ = goog.getUid($opt_obj$$27_sourcesArray$$1_srcUid$$), goog.events.sources_[$opt_obj$$27_sourcesArray$$1_srcUid$$]) {
      $opt_obj$$27_sourcesArray$$1_srcUid$$ = goog.events.sources_[$opt_obj$$27_sourcesArray$$1_srcUid$$];
      for(var $i$$0$$ = $opt_obj$$27_sourcesArray$$1_srcUid$$.length - 1;0 <= $i$$0$$;$i$$0$$--) {
        var $listener$$0$$ = $opt_obj$$27_sourcesArray$$1_srcUid$$[$i$$0$$];
        if(($noType$$ || $opt_type$$ == $listener$$0$$.type) && ($noCapt$$ || $opt_capt$$ == $listener$$0$$.capture)) {
          goog.events.unlistenByKey($listener$$0$$.key), $count$$++
        }
      }
    }
  }
  return $count$$
};
goog.events.getListeners = function $goog$events$getListeners$($obj$$, $type$$, $capture$$) {
  return goog.events.getListeners_($obj$$, $type$$, $capture$$) || []
};
goog.events.getListeners_ = function $goog$events$getListeners_$($obj$$, $type$$, $capture$$) {
  var $map$$ = goog.events.listenerTree_;
  return $type$$ in $map$$ && ($map$$ = $map$$[$type$$], $capture$$ in $map$$ && ($map$$ = $map$$[$capture$$], $obj$$ = goog.getUid($obj$$), $map$$[$obj$$])) ? $map$$[$obj$$] : null
};
goog.events.getListener = function $goog$events$getListener$($listenerArray$$4_src$$, $i$$58_type$$, $listener$$, $capture$$7_opt_capt$$, $opt_handler$$) {
  $capture$$7_opt_capt$$ = !!$capture$$7_opt_capt$$;
  if($listenerArray$$4_src$$ = goog.events.getListeners_($listenerArray$$4_src$$, $i$$58_type$$, $capture$$7_opt_capt$$)) {
    for($i$$58_type$$ = 0;$i$$58_type$$ < $listenerArray$$4_src$$.length;$i$$58_type$$++) {
      if(!$listenerArray$$4_src$$[$i$$58_type$$].removed && $listenerArray$$4_src$$[$i$$58_type$$].listener == $listener$$ && $listenerArray$$4_src$$[$i$$58_type$$].capture == $capture$$7_opt_capt$$ && $listenerArray$$4_src$$[$i$$58_type$$].handler == $opt_handler$$) {
        return $listenerArray$$4_src$$[$i$$58_type$$]
      }
    }
  }
  return null
};
goog.events.hasListener = function $goog$events$hasListener$($obj$$82_objUid$$, $opt_type$$, $opt_capture$$) {
  $obj$$82_objUid$$ = goog.getUid($obj$$82_objUid$$);
  var $listeners$$1_map$$ = goog.events.sources_[$obj$$82_objUid$$];
  if($listeners$$1_map$$) {
    var $hasType$$ = goog.isDef($opt_type$$), $hasCapture$$ = goog.isDef($opt_capture$$);
    return $hasType$$ && $hasCapture$$ ? ($listeners$$1_map$$ = goog.events.listenerTree_[$opt_type$$], !!$listeners$$1_map$$ && !!$listeners$$1_map$$[$opt_capture$$] && $obj$$82_objUid$$ in $listeners$$1_map$$[$opt_capture$$]) : !$hasType$$ && !$hasCapture$$ ? !0 : goog.array.some($listeners$$1_map$$, function($listener$$) {
      return $hasType$$ && $listener$$.type == $opt_type$$ || $hasCapture$$ && $listener$$.capture == $opt_capture$$
    })
  }
  return!1
};
goog.events.expose = function $goog$events$expose$($e$$) {
  var $str$$ = [], $key$$;
  for($key$$ in $e$$) {
    $e$$[$key$$] && $e$$[$key$$].id ? $str$$.push($key$$ + " = " + $e$$[$key$$] + " (" + $e$$[$key$$].id + ")") : $str$$.push($key$$ + " = " + $e$$[$key$$])
  }
  return $str$$.join("\n")
};
goog.events.getOnString_ = function $goog$events$getOnString_$($type$$) {
  return $type$$ in goog.events.onStringMap_ ? goog.events.onStringMap_[$type$$] : goog.events.onStringMap_[$type$$] = goog.events.onString_ + $type$$
};
goog.events.fireListeners = function $goog$events$fireListeners$($obj$$, $type$$, $capture$$, $eventObject$$) {
  var $map$$ = goog.events.listenerTree_;
  return $type$$ in $map$$ && ($map$$ = $map$$[$type$$], $capture$$ in $map$$) ? goog.events.fireListeners_($map$$[$capture$$], $obj$$, $type$$, $capture$$, $eventObject$$) : !0
};
goog.events.fireListeners_ = function $goog$events$fireListeners_$($listenerArray$$5_map$$, $obj$$84_objUid$$, $type$$, $capture$$, $eventObject$$) {
  var $retval$$ = 1;
  $obj$$84_objUid$$ = goog.getUid($obj$$84_objUid$$);
  if($listenerArray$$5_map$$[$obj$$84_objUid$$]) {
    $listenerArray$$5_map$$.remaining_--;
    $listenerArray$$5_map$$ = $listenerArray$$5_map$$[$obj$$84_objUid$$];
    $listenerArray$$5_map$$.locked_ ? $listenerArray$$5_map$$.locked_++ : $listenerArray$$5_map$$.locked_ = 1;
    try {
      for(var $length$$ = $listenerArray$$5_map$$.length, $i$$ = 0;$i$$ < $length$$;$i$$++) {
        var $listener$$ = $listenerArray$$5_map$$[$i$$];
        $listener$$ && !$listener$$.removed && ($retval$$ &= !1 !== goog.events.fireListener($listener$$, $eventObject$$))
      }
    }finally {
      $listenerArray$$5_map$$.locked_--, goog.events.cleanUp_($type$$, $capture$$, $obj$$84_objUid$$, $listenerArray$$5_map$$)
    }
  }
  return Boolean($retval$$)
};
goog.events.fireListener = function $goog$events$fireListener$($listener$$, $eventObject$$) {
  $listener$$.callOnce && goog.events.unlistenByKey($listener$$.key);
  return $listener$$.handleEvent($eventObject$$)
};
goog.events.getTotalListenerCount = function $goog$events$getTotalListenerCount$() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function $goog$events$dispatchEvent$($src$$, $e$$) {
  var $hasCapture$$1_type$$ = $e$$.type || $e$$, $current$$1_map$$ = goog.events.listenerTree_;
  if(!($hasCapture$$1_type$$ in $current$$1_map$$)) {
    return!0
  }
  if(goog.isString($e$$)) {
    $e$$ = new goog.events.Event($e$$, $src$$)
  }else {
    if($e$$ instanceof goog.events.Event) {
      $e$$.target = $e$$.target || $src$$
    }else {
      var $oldEvent_rv$$ = $e$$;
      $e$$ = new goog.events.Event($hasCapture$$1_type$$, $src$$);
      goog.object.extend($e$$, $oldEvent_rv$$)
    }
  }
  var $oldEvent_rv$$ = 1, $ancestors$$, $current$$1_map$$ = $current$$1_map$$[$hasCapture$$1_type$$], $hasCapture$$1_type$$ = !0 in $current$$1_map$$, $parent$$;
  if($hasCapture$$1_type$$) {
    $ancestors$$ = [];
    for($parent$$ = $src$$;$parent$$;$parent$$ = $parent$$.getParentEventTarget()) {
      $ancestors$$.push($parent$$)
    }
    $parent$$ = $current$$1_map$$[!0];
    $parent$$.remaining_ = $parent$$.count_;
    for(var $i$$ = $ancestors$$.length - 1;!$e$$.propagationStopped_ && 0 <= $i$$ && $parent$$.remaining_;$i$$--) {
      $e$$.currentTarget = $ancestors$$[$i$$], $oldEvent_rv$$ &= goog.events.fireListeners_($parent$$, $ancestors$$[$i$$], $e$$.type, !0, $e$$) && !1 != $e$$.returnValue_
    }
  }
  if(!1 in $current$$1_map$$) {
    if($parent$$ = $current$$1_map$$[!1], $parent$$.remaining_ = $parent$$.count_, $hasCapture$$1_type$$) {
      for($i$$ = 0;!$e$$.propagationStopped_ && $i$$ < $ancestors$$.length && $parent$$.remaining_;$i$$++) {
        $e$$.currentTarget = $ancestors$$[$i$$], $oldEvent_rv$$ &= goog.events.fireListeners_($parent$$, $ancestors$$[$i$$], $e$$.type, !1, $e$$) && !1 != $e$$.returnValue_
      }
    }else {
      for($current$$1_map$$ = $src$$;!$e$$.propagationStopped_ && $current$$1_map$$ && $parent$$.remaining_;$current$$1_map$$ = $current$$1_map$$.getParentEventTarget()) {
        $e$$.currentTarget = $current$$1_map$$, $oldEvent_rv$$ &= goog.events.fireListeners_($parent$$, $current$$1_map$$, $e$$.type, !1, $e$$) && !1 != $e$$.returnValue_
      }
    }
  }
  return Boolean($oldEvent_rv$$)
};
goog.events.protectBrowserEventEntryPoint = function $goog$events$protectBrowserEventEntryPoint$($errorHandler$$) {
  goog.events.handleBrowserEvent_ = $errorHandler$$.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function $goog$events$handleBrowserEvent_$($key$$, $opt_evt$$) {
  if(!goog.events.listeners_[$key$$]) {
    return!0
  }
  var $listener$$ = goog.events.listeners_[$key$$], $be$$1_type$$ = $listener$$.type, $map$$ = goog.events.listenerTree_;
  if(!($be$$1_type$$ in $map$$)) {
    return!0
  }
  var $map$$ = $map$$[$be$$1_type$$], $ieEvent_retval$$, $targetsMap$$;
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    $ieEvent_retval$$ = $opt_evt$$ || goog.getObjectByName("window.event");
    var $hasCapture$$ = !0 in $map$$, $hasBubble$$ = !1 in $map$$;
    if($hasCapture$$) {
      if(goog.events.isMarkedIeEvent_($ieEvent_retval$$)) {
        return!0
      }
      goog.events.markIeEvent_($ieEvent_retval$$)
    }
    var $evt$$ = new goog.events.BrowserEvent;
    $evt$$.init($ieEvent_retval$$, this);
    $ieEvent_retval$$ = !0;
    try {
      if($hasCapture$$) {
        for(var $ancestors$$ = [], $parent$$ = $evt$$.currentTarget;$parent$$;$parent$$ = $parent$$.parentNode) {
          $ancestors$$.push($parent$$)
        }
        $targetsMap$$ = $map$$[!0];
        $targetsMap$$.remaining_ = $targetsMap$$.count_;
        for(var $i$$ = $ancestors$$.length - 1;!$evt$$.propagationStopped_ && 0 <= $i$$ && $targetsMap$$.remaining_;$i$$--) {
          $evt$$.currentTarget = $ancestors$$[$i$$], $ieEvent_retval$$ &= goog.events.fireListeners_($targetsMap$$, $ancestors$$[$i$$], $be$$1_type$$, !0, $evt$$)
        }
        if($hasBubble$$) {
          $targetsMap$$ = $map$$[!1];
          $targetsMap$$.remaining_ = $targetsMap$$.count_;
          for($i$$ = 0;!$evt$$.propagationStopped_ && $i$$ < $ancestors$$.length && $targetsMap$$.remaining_;$i$$++) {
            $evt$$.currentTarget = $ancestors$$[$i$$], $ieEvent_retval$$ &= goog.events.fireListeners_($targetsMap$$, $ancestors$$[$i$$], $be$$1_type$$, !1, $evt$$)
          }
        }
      }else {
        $ieEvent_retval$$ = goog.events.fireListener($listener$$, $evt$$)
      }
    }finally {
      $ancestors$$ && ($ancestors$$.length = 0)
    }
    return $ieEvent_retval$$
  }
  $be$$1_type$$ = new goog.events.BrowserEvent($opt_evt$$, this);
  return $ieEvent_retval$$ = goog.events.fireListener($listener$$, $be$$1_type$$)
};
goog.events.markIeEvent_ = function $goog$events$markIeEvent_$($e$$) {
  var $useReturnValue$$ = !1;
  if(0 == $e$$.keyCode) {
    try {
      $e$$.keyCode = -1;
      return
    }catch($ex$$) {
      $useReturnValue$$ = !0
    }
  }
  if($useReturnValue$$ || void 0 == $e$$.returnValue) {
    $e$$.returnValue = !0
  }
};
goog.events.isMarkedIeEvent_ = function $goog$events$isMarkedIeEvent_$($e$$) {
  return 0 > $e$$.keyCode || void 0 != $e$$.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function $goog$events$getUniqueId$($identifier$$) {
  return $identifier$$ + "_" + goog.events.uniqueIdCounter_++
};
goog.debug.entryPointRegistry.register(function($transformer$$) {
  goog.events.handleBrowserEvent_ = $transformer$$(goog.events.handleBrowserEvent_)
});
var ww = {util:{}};
ww.util.floatComplexGaussianRandom = function $ww$util$floatComplexGaussianRandom$() {
  var $x1$$, $x2$$, $w$$, $out$$ = [];
  do {
    $x1$$ = 2 * Math.random() - 1, $x2$$ = 2 * Math.random() - 1, $w$$ = $x1$$ * $x1$$ + $x2$$ * $x2$$
  }while(1 <= $w$$);
  $w$$ = Math.sqrt(-1 * Math.log($w$$) / $w$$);
  $out$$[0] = $x1$$ * $w$$;
  $out$$[1] = $x2$$ * $w$$;
  return $out$$
};
(function() {
  for(var $lastTime$$ = 0, $vendors$$ = ["ms", "moz", "webkit", "o"], $x$$ = 0;$x$$ < $vendors$$.length && !window.requestAnimationFrame;++$x$$) {
    window.requestAnimationFrame = window[$vendors$$[$x$$] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[$vendors$$[$x$$] + "CancelAnimationFrame"] || window[$vendors$$[$x$$] + "CancelRequestAnimationFrame"]
  }
  window.requestAnimationFrame || (window.requestAnimationFrame = function $window$requestAnimationFrame$($callback$$) {
    var $currTime$$ = (new Date).getTime(), $timeToCall$$ = Math.max(0, 16 - ($currTime$$ - $lastTime$$)), $id$$ = window.setTimeout(function() {
      $callback$$($currTime$$ + $timeToCall$$)
    }, $timeToCall$$);
    $lastTime$$ = $currTime$$ + $timeToCall$$;
    return $id$$
  });
  window.cancelAnimationFrame || (window.cancelAnimationFrame = function $window$cancelAnimationFrame$($id$$) {
    clearTimeout($id$$)
  })
})();
ww.raqSubscribers = {};
ww.raqRunning = !1;
ww.lastTime = 0;
ww.testMode = -1 < window.location.href.indexOf("test");
var subscriberKey, loopSubscriber, loopCurrentTime, loopDelta;
ww.raqOnFrame = function $ww$raqOnFrame$($t$$) {
  loopCurrentTime = $t$$ || (new Date).getTime();
  loopDelta = loopCurrentTime - ww.lastTime;
  for(subscriberKey in ww.raqSubscribers) {
    ww.raqSubscribers.hasOwnProperty(subscriberKey) && (loopSubscriber = ww.raqSubscribers[subscriberKey], loopSubscriber[1].call(loopSubscriber[0], loopDelta))
  }
  ww.lastTime = loopCurrentTime;
  ww.raqRunning && requestAnimationFrame(ww.raqOnFrame)
};
ww.raqUpdateStatus = function $ww$raqUpdateStatus$() {
  var $len$$ = 0, $key$$;
  for($key$$ in ww.raqSubscribers) {
    ww.raqSubscribers.hasOwnProperty($key$$) && $len$$++
  }
  0 < $len$$ ? ww.raqRunning || (ww.raqRunning = !0, ww.lastTime = (new Date).getTime(), ww.raqOnFrame()) : ww.raqRunning && (ww.raqRunning = !1)
};
ww.raqSubscribe = function $ww$raqSubscribe$($name$$, $obj$$, $func$$) {
  ww.raqSubscribers[$name$$] = [$obj$$, $func$$];
  ww.raqUpdateStatus()
};
ww.raqUnsubscribe = function $ww$raqUnsubscribe$($name$$) {
  delete ww.raqSubscribers[$name$$];
  ww.raqUpdateStatus()
};
ww.mode = {};
window.AudioContext = window.AudioContext || window.webkitAudioContext || null;
ww.mode.Core = function $ww$mode$Core$($name$$, $wantsAudio$$, $wantsDrawing$$, $wantsPhysics$$) {
  this.prefix_ = Modernizr.prefixed("transform");
  this.name_ = $name$$;
  this.hasFocus = !1;
  this.wantsAudio_ = $wantsAudio$$ && window.AudioContext || !1;
  this.wantsDrawing_ = $wantsDrawing$$ || !1;
  this.wantsPhysics_ = $wantsPhysics$$ || !1;
  this.wantsRenderLoop_ = this.wantsDrawing_ || this.wantsPhysics_ || !1;
  this.tweens_ = [];
  !ww.testMode && DEBUG_MODE && this.addDebugUI_();
  var $self$$ = this;
  goog.events.listen(window, "message", function($data$$29_evt$$) {
    $data$$29_evt$$ = $data$$29_evt$$.getBrowserEvent().data;
    $self$$.log("Got message: " + $data$$29_evt$$.name, $data$$29_evt$$);
    "focus" === $data$$29_evt$$.name ? $self$$.focus() : "unfocus" === $data$$29_evt$$.name && $self$$.unfocus()
  });
  this.window_ = $(window);
  this.height_ = this.width_ = 0;
  this.window_.resize(function() {
    $self$$.onResize(!0)
  });
  this.onResize();
  Modernizr.touch && (document.body.style[Modernizr.prefixed("userSelect")] = "none", document.body.style[Modernizr.prefixed("userSelect")] = "none", document.body.style[Modernizr.prefixed("userDrag")] = "none", document.body.style[Modernizr.prefixed("tapHighlightColor")] = "rgba(0,0,0,0)");
  this.init();
  $(function() {
    $self$$.letterI = $("#letter-i");
    $self$$.letterO = $("#letter-o");
    $self$$.focus()
  });
  this.ready()
};
ww.mode.Core.prototype.log = function $ww$mode$Core$$log$($msg$$) {
  if(DEBUG_MODE && console && console.log) {
    var $args$$ = Array.prototype.slice.call(arguments);
    "string" === typeof $args$$[0] && ($args$$[0] = this.name_ + ": " + $args$$[0]);
    console.log.apply(console, $args$$)
  }
};
ww.mode.Core.prototype.init = function $ww$mode$Core$$init$() {
  this.log("Init");
  this.wantsPhysics_ && this.resetPhysicsWorld_()
};
ww.mode.Core.prototype.showReload = function $ww$mode$Core$$showReload$() {
  this.unfocus();
  var $self$$ = this;
  this.$reloadModal_ || (this.$reloadModal_ = $("#reload"), this.$reloadModal_.length || (this.$reloadModal_ = $("<div id='reload'></div>").appendTo(document.body)), this.$reloadModal_.bind((Modernizr.touch ? "touchend" : "mouseup") + ".reload", function() {
    $self$$.$reloadModal_.hide();
    $self$$.init();
    $self$$.focus()
  }));
  this.$reloadModal_.show()
};
ww.mode.Core.prototype.onResize = function $ww$mode$Core$$onResize$($redraw$$) {
  this.width_ = this.window_.width();
  this.height_ = this.window_.height();
  this.log("Resize " + this.width_ + "x" + this.height_);
  this.paperCanvas_ && (this.paperCanvas_.width = this.width_, this.paperCanvas_.height = this.height_, paper.view.setViewSize(this.width_, this.height_));
  $redraw$$ && this.redraw()
};
DEBUG_MODE && (ww.mode.Core.prototype.addDebugUI_ = function $ww$mode$Core$$addDebugUI_$() {
  var $self$$ = this, $focusElem$$ = document.createElement("button");
  $focusElem$$.style.fontSize = "15px";
  $focusElem$$.innerHTML = "Focus";
  $focusElem$$.onclick = function $$focusElem$$$onclick$() {
    $self$$.focus()
  };
  var $unfocusElem$$ = document.createElement("button");
  $unfocusElem$$.style.fontSize = "15px";
  $unfocusElem$$.innerHTML = "Unfocus";
  $unfocusElem$$.onclick = function $$unfocusElem$$$onclick$() {
    $self$$.unfocus()
  };
  var $restartElem$$ = document.createElement("button");
  $restartElem$$.style.fontSize = "15px";
  $restartElem$$.innerHTML = "Restart";
  $restartElem$$.onclick = function $$restartElem$$$onclick$() {
    $self$$.init()
  };
  var $containerElem$$ = document.createElement("div");
  $containerElem$$.style.position = "fixed";
  $containerElem$$.style.bottom = 0;
  $containerElem$$.style.left = 0;
  $containerElem$$.style.right = 0;
  $containerElem$$.style.height = "40px";
  $containerElem$$.style.background = "rgba(0,0,0,0.2)";
  $containerElem$$.appendChild($focusElem$$);
  $containerElem$$.appendChild($unfocusElem$$);
  $containerElem$$.appendChild($restartElem$$);
  document.body.appendChild($containerElem$$)
});
ww.mode.Core.prototype.startRendering = function $ww$mode$Core$$startRendering$() {
  this.wantsRenderLoop_ && (this.timeElapsed_ = this.framesRendered_ = 0, ww.raqSubscribe(this.name_, this, this.renderFrame))
};
ww.mode.Core.prototype.stopRendering = function $ww$mode$Core$$stopRendering$() {
  this.wantsRenderLoop_ && ww.raqUnsubscribe(this.name_)
};
ww.mode.Core.prototype.renderFrame = function $ww$mode$Core$$renderFrame$($delta$$) {
  this.timeElapsed_ += $delta$$;
  $delta$$ *= 0.0010;
  0.5 < $delta$$ && ($delta$$ = 0.016);
  this.wantsPhysics_ && this.stepPhysics($delta$$);
  TWEEN.update(this.timeElapsed_);
  if(this.wantsDrawing_) {
    this.onFrame($delta$$)
  }
  this.framesRendered_++
};
ww.mode.Core.prototype.redraw = function $ww$mode$Core$$redraw$() {
  if(this.wantsDrawing_) {
    this.onFrame(0)
  }
};
ww.mode.Core.prototype.onFrame = function $ww$mode$Core$$onFrame$() {
  this.paperCanvas_ && paper.view.draw()
};
ww.mode.Core.prototype.ready = function $ww$mode$Core$$ready$() {
  window.currentMode = this;
  if(window.onModeReady) {
    window.onModeReady(this)
  }
  this.log("Is ready");
  this.sendMessage_(this.name_ + ".ready")
};
ww.mode.Core.prototype.sendMessage_ = function $ww$mode$Core$$sendMessage_$($msgName$$, $value$$) {
  window.parent && window.parent.postMessage && window.parent.postMessage({name:$msgName$$, data:$value$$}, "*")
};
ww.mode.Core.prototype.focus = function $ww$mode$Core$$focus$() {
  this.hasFocus || (this.log("Got focus"), this.hasFocus = !0, this.startRendering(), this.didFocus())
};
ww.mode.Core.prototype.didFocus = function $ww$mode$Core$$didFocus$() {
  var $self$$ = this, $hammerOpts$$ = {prevent_default:!0}, $evt$$ = Modernizr.touch ? "touchend" : "mouseup";
  this.letterI.bind($evt$$ + ".core", $hammerOpts$$, function() {
    $self$$.activateI()
  });
  this.letterO.bind($evt$$ + ".core", $hammerOpts$$, function() {
    $self$$.activateO()
  });
  $(document).bind("keypress.core", function($e$$) {
    if(105 === $e$$.keyCode) {
      $self$$.activateI()
    }else {
      if(111 === $e$$.keyCode) {
        $self$$.activateO()
      }else {
        return
      }
    }
    $e$$.preventDefault();
    $e$$.stopPropagation();
    return!1
  })
};
ww.mode.Core.prototype.unfocus = function $ww$mode$Core$$unfocus$() {
  this.hasFocus && (this.log("Lost focus"), this.hasFocus = !1, this.stopRendering(), this.didUnfocus())
};
ww.mode.Core.prototype.didUnfocus = function $ww$mode$Core$$didUnfocus$() {
  var $evt$$ = Modernizr.touch ? "touchend" : "mouseup";
  this.letterI.unbind($evt$$ + ".core");
  this.letterO.unbind($evt$$ + ".core");
  $(document).unbind("keypress.core")
};
ww.mode.Core.prototype.getSoundBufferFromURL_ = function $ww$mode$Core$$getSoundBufferFromURL_$($url$$, $gotSound$$) {
  this.soundBuffersFromURL_ = this.soundBuffersFromURL_ || {};
  if(this.soundBuffersFromURL_[$url$$]) {
    $gotSound$$(this.soundBuffersFromURL_[$url$$])
  }else {
    var $request$$ = new XMLHttpRequest;
    $request$$.open("GET", $url$$, !0);
    $request$$.responseType = "arraybuffer";
    var $self$$ = this;
    $request$$.onload = function $$request$$$onload$() {
      $self$$.getAudioContext_().decodeAudioData($request$$.response, function($buffer$$) {
        $self$$.soundBuffersFromURL_[$url$$] = $buffer$$;
        $gotSound$$($self$$.soundBuffersFromURL_[$url$$])
      }, function() {
      })
    };
    $request$$.send()
  }
};
ww.mode.Core.prototype.getPhysicsWorld_ = function $ww$mode$Core$$getPhysicsWorld_$() {
  return this.physicsWorld_ ? this.physicsWorld_ : this.physicsWorld_ = new window.Physics
};
ww.mode.Core.prototype.resetPhysicsWorld_ = function $ww$mode$Core$$resetPhysicsWorld_$() {
  this.physicsWorld_ && this.physicsWorld_.destroy && this.physicsWorld_.destroy();
  this.physicsWorld_ = null
};
ww.mode.Core.prototype.stepPhysics = function $ww$mode$Core$$stepPhysics$($delta$$3_i$$) {
  if(0 < $delta$$3_i$$) {
    var $world$$ = this.physicsWorld_;
    $world$$.integrate($delta$$3_i$$);
    if(this.paperCanvas_) {
      for($delta$$3_i$$ = 0;$delta$$3_i$$ < $world$$.particles.length;$delta$$3_i$$++) {
        var $p$$ = $world$$.particles[$delta$$3_i$$];
        "undefined" !== typeof $p$$.drawObj && $p$$.drawObj.position && ($p$$.drawObj.position.x = $p$$.pos.x, $p$$.drawObj.position.y = $p$$.pos.y)
      }
    }
  }
};
ww.mode.Core.prototype.getAudioContext_ = function $ww$mode$Core$$getAudioContext_$() {
  return this.audioContext_ = this.audioContext_ || new window.AudioContext
};
ww.mode.Core.prototype.playSound = function $ww$mode$Core$$playSound$($filename$$) {
  if(this.wantsAudio_) {
    var $url$$ = "../sounds/" + this.name_ + "/" + $filename$$;
    ww.testMode && ($url$$ = "../" + $url$$);
    this.log('Requested sound "' + $filename$$ + '" from "' + $url$$ + '"');
    var $audioContext$$ = this.getAudioContext_();
    this.getSoundBufferFromURL_($url$$, function($buffer$$) {
      var $source$$ = $audioContext$$.createBufferSource();
      $source$$.buffer = $buffer$$;
      $source$$.connect($audioContext$$.destination);
      $source$$.noteOn(0)
    })
  }
};
ww.mode.Core.prototype.activateI = function $ww$mode$Core$$activateI$() {
  this.log('Activated "I"')
};
ww.mode.Core.prototype.activateO = function $ww$mode$Core$$activateO$() {
  this.log('Activated "O"')
};
ww.mode.Core.prototype.transformElem_ = function $ww$mode$Core$$transformElem_$($elem$$, $value$$) {
  $elem$$.style[this.prefix_] = $value$$
};
ww.mode.Core.prototype.getPaperCanvas_ = function $ww$mode$Core$$getPaperCanvas_$() {
  this.paperCanvas_ || (this.paperCanvas_ = document.createElement("canvas"), this.paperCanvas_.width = this.width_, this.paperCanvas_.height = this.height_, $(document.body).prepend(this.paperCanvas_), paper.setup(this.paperCanvas_));
  return this.paperCanvas_
};
ww.mode.Core.prototype.addTween = function $ww$mode$Core$$addTween$($tween$$) {
  $tween$$.start(this.timeElapsed_)
};
ww.mode.CatMode = function $ww$mode$CatMode$() {
  ww.mode.Core.call(this, "cat", !0, !0)
};
goog.inherits(ww.mode.CatMode, ww.mode.Core);
ww.mode.CatMode.prototype.activateI = function $ww$mode$CatMode$$activateI$() {
  ww.mode.CatMode.superClass_.activateI.call(this);
  this.playSound("cat-1.mp3");
  var $self$$ = this, $stretchOut$$ = new TWEEN.Tween({scaleY:1});
  $stretchOut$$.to({scaleY:1.55}, 200);
  $stretchOut$$.easing(TWEEN.Easing.Bounce.InOut);
  $stretchOut$$.onUpdate(function() {
    $self$$.transformElem_($self$$.letterI[0], "scaleY(" + this.scaleY + ")")
  });
  var $stretchBack$$ = new TWEEN.Tween({scaleY:1.55});
  $stretchBack$$.to({scaleY:1}, 200);
  $stretchBack$$.easing(TWEEN.Easing.Bounce.InOut);
  $stretchBack$$.delay(200);
  $stretchBack$$.onUpdate(function() {
    $self$$.transformElem_($self$$.letterI[0], "scaleY(" + this.scaleY + ")")
  });
  this.addTween($stretchOut$$);
  this.addTween($stretchBack$$)
};
ww.mode.CatMode.prototype.activateO = function $ww$mode$CatMode$$activateO$() {
  ww.mode.CatMode.superClass_.activateO.call(this);
  this.playSound("cat-2.mp3");
  var $self$$ = this, $moveBack_position$$ = [Random(-200, 200), Random(-50, 50)], $moveOut$$ = new TWEEN.Tween({scale:1, x:0, y:0});
  $moveOut$$.to({scale:1.5, x:$moveBack_position$$[0], y:$moveBack_position$$[1]}, 200);
  $moveOut$$.easing(TWEEN.Easing.Bounce.InOut);
  $moveOut$$.onUpdate(function() {
    var $translate$$ = "translate(" + this.x + "px, " + this.y + "px) ", $translate$$ = $translate$$ + ("scale(" + this.scale + ")");
    $self$$.transformElem_($self$$.letterO[0], $translate$$)
  });
  $moveBack_position$$ = new TWEEN.Tween({scale:1.5, x:$moveBack_position$$[0], y:$moveBack_position$$[1]});
  $moveBack_position$$.to({scale:1, x:0, y:0}, 200);
  $moveBack_position$$.delay(200);
  $moveBack_position$$.easing(TWEEN.Easing.Bounce.InOut);
  $moveBack_position$$.onUpdate(function() {
    var $translate$$ = "translate(" + this.x + "px, " + this.y + "px) ", $translate$$ = $translate$$ + ("scale(" + this.scale + ")");
    $self$$.transformElem_($self$$.letterO[0], $translate$$)
  });
  this.addTween($moveOut$$);
  this.addTween($moveBack_position$$)
};
ww.mode.BaconMode = function $ww$mode$BaconMode$() {
  ww.mode.Core.call(this, "bacon", !0, !0)
};
goog.inherits(ww.mode.BaconMode, ww.mode.Core);
ww.mode.BaconMode.prototype.init = function $ww$mode$BaconMode$$init$() {
  ww.mode.BaconMode.superClass_.init.call(this);
  this.container = $("#bacon-container").css("opacity", 1);
  this.bacon = $("#bacon");
  this.eggs = $("eggs")
};
ww.mode.HomeMode = function $ww$mode$HomeMode$() {
  ww.mode.Core.call(this, "home", !0, !0);
  this.setupPatternMatchers_();
  this.currentPattern_ = "";
  this.maxPatternLength_ = 15
};
goog.inherits(ww.mode.HomeMode, ww.mode.Core);
function pad($number$$, $length$$) {
  for(var $str$$ = "" + $number$$;$str$$.length < $length$$;) {
    $str$$ = "0" + $str$$
  }
  return $str$$
}
ww.mode.HomeMode.prototype.playProcessedAudio_ = function $ww$mode$HomeMode$$playProcessedAudio_$($filename$$, $filter$$) {
  if(this.wantsAudio_) {
    var $url$$ = "../sounds/" + this.name_ + "/" + $filename$$;
    ww.testMode && ($url$$ = "../" + $url$$);
    this.log('Requested sound "' + $filename$$ + '" from "' + $url$$ + '"');
    var $audioContext$$ = this.audioContext_;
    this.getSoundBufferFromURL_($url$$, function($buffer$$) {
      var $source$$ = $audioContext$$.createBufferSource();
      $source$$.buffer = $buffer$$;
      $source$$.connect($filter$$.input);
      $filter$$.connect($audioContext$$.destination);
      $source$$.noteOn(0)
    })
  }
};
ww.mode.HomeMode.prototype.activateI = function $ww$mode$HomeMode$$activateI$() {
  this.iClicked_ = !0;
  10 > this.iMultiplier_ && (this.iMultiplier_ += 2);
  this.playProcessedAudio_("boing.wav", this.chorus_);
  this.addCharacter_("1")
};
ww.mode.HomeMode.prototype.activateO = function $ww$mode$HomeMode$$activateO$() {
  this.oClicked_ = !0;
  10 > this.oMultiplier_ && (this.oMultiplier_ += 2);
  this.playProcessedAudio_("boing.wav", this.delay_);
  this.addCharacter_("0")
};
ww.mode.HomeMode.prototype.setupPatternMatchers_ = function $ww$mode$HomeMode$$setupPatternMatchers_$() {
  var $patterns$$ = {}, $key$$, $mode$$;
  for($key$$ in ww.mode.modes) {
    ww.mode.modes.hasOwnProperty($key$$) && ww.mode.modes[$key$$].pattern && ($mode$$ = ww.mode.modes[$key$$], $patterns$$[$key$$] = {klass:$mode$$.klass, binaryPattern:pad($mode$$.pattern.toString(2), $mode$$.len)})
  }
  this.matchers_ = [];
  for($key$$ in $patterns$$) {
    if($patterns$$.hasOwnProperty($key$$)) {
      $mode$$ = $patterns$$[$key$$];
      this.log("Building matchers for: " + $mode$$.binaryPattern);
      for(var $i$$ = 0;$i$$ < $mode$$.binaryPattern.length;$i$$++) {
        this.matchers_.push({key:$key$$, matcher:$mode$$.binaryPattern.slice(0, $i$$ + 1), isPartial:$i$$ + 1 != $mode$$.binaryPattern.length})
      }
    }
  }
};
ww.mode.HomeMode.prototype.addCharacter_ = function $ww$mode$HomeMode$$addCharacter_$($matched_str$$) {
  this.currentPattern_ += $matched_str$$;
  this.currentPattern_.length > this.maxPatternLength_ && (this.currentPattern_ = this.currentPattern_.slice(-this.maxPatternLength_, this.currentPattern_.length));
  this.log("current pattern: " + this.currentPattern_);
  $("#pattern").text(this.currentPattern_);
  if($matched_str$$ = this.runMatchers_()) {
    this.log("matched", $matched_str$$), $matched_str$$.isPartial || this.goToMode_($matched_str$$.key)
  }
};
ww.mode.HomeMode.prototype.runMatchers_ = function $ww$mode$HomeMode$$runMatchers_$() {
  for(var $matches$$ = [], $i$$ = 0;$i$$ < this.matchers_.length;$i$$++) {
    var $j$$ = this.matchers_[$i$$];
    if(-1 < this.currentPattern_.slice(-$j$$.matcher.length, this.currentPattern_.length).indexOf($j$$.matcher) && ($matches$$.push({matcher:$j$$, len:$j$$.matcher.length, isPartial:$j$$.isPartial}), !$j$$.isPartial)) {
      return $j$$
    }
  }
  for(var $found$$, $j$$ = $i$$ = 0;$j$$ < $matches$$.length;$j$$++) {
    $matches$$[$j$$].len > $i$$ && ($found$$ = $matches$$[$j$$].matcher, $i$$ = $matches$$[$j$$].len)
  }
  return $found$$
};
ww.mode.HomeMode.prototype.goToMode_ = function $ww$mode$HomeMode$$goToMode_$($key$$) {
  this.sendMessage_("goToMode", $key$$)
};
ww.mode.HomeMode.prototype.drawI_ = function $ww$mode$HomeMode$$drawI_$($iTopLeft_isNew$$) {
  this.iWidth_ = 0.175 * this.width_;
  this.iHeight_ = 2.12698413 * this.iWidth_;
  this.i_X = this.screenCenterX_ - 1.5 * this.iWidth_;
  this.i_Y = this.screenCenterY_ - this.iHeight_ / 2;
  if($iTopLeft_isNew$$) {
    $iTopLeft_isNew$$ = new paper.Point(this.i_X, this.i_Y);
    var $iSize$$ = new paper.Size(this.iWidth_, this.iHeight_);
    this.letterI_ = new paper.Rectangle($iTopLeft_isNew$$, $iSize$$);
    this.paperI_ = new paper.Path.Rectangle(this.letterI_);
    this.paperI_.fillColor = "#11a860";
    this.i_PointX = [];
    this.i_PointY_ = [];
    for(this.i_ = 0;this.i_ < this.paperI_.segments.length;this.i_++) {
      this.i_PointX.push(this.paperI_.segments[this.i_].point._x), this.i_PointY_.push(this.paperI_.segments[this.i_].point._y)
    }
  }else {
    if(!$iTopLeft_isNew$$ && this.paperI_) {
      this.paperI_.position = {x:this.i_X + this.iWidth_ / 2, y:this.i_Y + this.iHeight_ / 2};
      this.paperI_.scale(this.iWidth_ / this.paperI_.bounds.width);
      for(this.i_ = 0;this.i_ < this.paperI_.segments.length;this.i_++) {
        this.i_PointX[this.i_] = this.paperI_.segments[this.i_].point._x, this.i_PointY_[this.i_] = this.paperI_.segments[this.i_].point._y
      }
    }else {
      this.log("drawI_(true) must be called before it can be redrawn")
    }
  }
};
ww.mode.HomeMode.prototype.drawO_ = function $ww$mode$HomeMode$$drawO_$($isNew$$) {
  this.oRad_ = 0.1944444444 * this.width_;
  this.oX_ = this.screenCenterX_ + this.oRad_;
  this.oY_ = this.screenCenterY_;
  if($isNew$$) {
    $isNew$$ = new paper.Point(this.oX_, this.oY_);
    this.paperO_ = new paper.Path.Circle($isNew$$, this.oRad_);
    this.paperO_.fillColor = "#3777e2";
    this.oHandleInX_ = [];
    this.oHandleInY_ = [];
    this.oHandleOutX_ = [];
    this.oHandleOutY_ = [];
    this.oPointX_ = [];
    this.oPointY_ = [];
    for(this.i_ = 0;this.i_ < this.paperO_.segments.length;this.i_++) {
      this.oPointX_.push(this.paperO_.segments[this.i_].point._x), this.oPointY_.push(this.paperO_.segments[this.i_].point._y), this.oHandleInX_.push(this.paperO_.segments[this.i_].handleIn._x), this.oHandleInY_.push(this.paperO_.segments[this.i_].handleIn._y), this.oHandleOutX_.push(this.paperO_.segments[this.i_].handleOut._x), this.oHandleOutY_.push(this.paperO_.segments[this.i_].handleOut._y)
    }
  }else {
    if(!$isNew$$ && this.paperO_) {
      this.paperO_.position = {x:this.oX_, y:this.oY_};
      this.paperO_.scale(2 * this.oRad_ / this.paperO_.bounds.height);
      for(this.i_ = 0;this.i_ < this.paperO_.segments.length;this.i_++) {
        this.oPointX_[this.i_] = this.paperO_.segments[this.i_].point._x, this.oPointY_[this.i_] = this.paperO_.segments[this.i_].point._y, this.oHandleInX_[this.i_] = this.paperO_.segments[this.i_].handleIn._x, this.oHandleInY_[this.i_] = this.paperO_.segments[this.i_].handleIn._y, this.oHandleOutX_[this.i_] = this.paperO_.segments[this.i_].handleOut._x, this.oHandleOutY_[this.i_] = this.paperO_.segments[this.i_].handleOut._y
      }
    }else {
      this.log("drawO_(true) must be called before it can be redrawn")
    }
  }
};
ww.mode.HomeMode.prototype.drawSlash_ = function $ww$mode$HomeMode$$drawSlash_$($isNew$$) {
  $isNew$$ && this.paperI_ && this.paperO_ ? (this.slashStart_ = new paper.Point(this.screenCenterX_ + this.oRad_ / 8, this.screenCenterY_ - this.iHeight_ / 2 - 0.17475728 * 1.5 * this.iHeight_), this.slashEnd_ = new paper.Point(this.i_X + this.iWidth_, this.screenCenterY_ + this.iHeight_ / 2 + 0.17475728 * 1.5 * this.iHeight_), this.paperSlash_ = new paper.Path, this.paperSlash_.strokeWidth = 0.01388889 * this.width_, this.paperSlash_.strokeColor = "#ebebeb", this.paperSlash_.add(this.slashStart_, 
  this.slashEnd_)) : !$isNew$$ && this.paperSlash_ ? (this.slashStart_.x = this.screenCenterX_ + this.oRad_ / 8, this.slashStart_.y = this.screenCenterY_ - this.iHeight_ / 2 - 0.17475728 * 1.5 * this.iHeight_, this.slashEnd_.x = this.i_X + this.iWidth_, this.slashEnd_.y = this.screenCenterY_ + this.iHeight_ / 2 + 0.17475728 * 1.5 * this.iHeight_, this.paperSlash_.segments[0].point = this.slashStart_, this.paperSlash_.segments[1].point = this.slashEnd_, this.paperSlash_.strokeWidth = 0.01388889 * 
  this.width_) : this.log("The I and O must be created before the slash can be drawn.")
};
ww.mode.HomeMode.prototype.init = function $ww$mode$HomeMode$$init$() {
  ww.mode.HomeMode.superClass_.init.call(this);
  this.getAudioContext_();
  var $tuna$$ = new Tuna(this.audioContext_);
  this.delay_ = new $tuna$$.Delay({feedback:0, delayTime:0, wetLevel:0, dryLevel:0, cutoff:20, bypass:0});
  this.chorus_ = new $tuna$$.Chorus({rate:0.01, feedback:0.2, delay:0, bypass:0});
  this.getPaperCanvas_();
  this.deltaModifier_ = 0;
  this.tempFloat = [];
  this.i_ = 0;
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;
  this.lastClick = new paper.Point(this.screenCenterX_, this.screenCenterY_);
  this.iClicked_ = !1;
  this.iIncrement_ = !0;
  this.iModifier_ = 0;
  this.iMultiplier_ = 1;
  this.drawI_(!0);
  this.oClicked_ = !1;
  this.oIncrement_ = !0;
  this.oModifier_ = 0;
  this.oMultiplier_ = 1;
  this.drawO_(!0);
  this.drawSlash_(!0)
};
ww.mode.HomeMode.prototype.didFocus = function $ww$mode$HomeMode$$didFocus$() {
  ww.mode.HomeMode.superClass_.didFocus.call(this);
  var $self$$ = this;
  this.getPaperCanvas_();
  (new paper.Tool).onMouseDown = function $paper$Tool$onMouseDown$($event$$) {
    $self$$.lastClick = $event$$.point;
    $self$$.paperO_.hitTest($event$$.point) && $self$$.activateO();
    $self$$.paperI_.hitTest($event$$.point) && $self$$.activateI()
  }
};
ww.mode.HomeMode.prototype.onResize = function $ww$mode$HomeMode$$onResize$($redraw$$) {
  ww.mode.HomeMode.superClass_.onResize.call(this, !1);
  this.screenCenterX_ = this.width_ / 2;
  this.screenCenterY_ = this.height_ / 2;
  this.drawI_();
  this.drawO_();
  this.drawSlash_();
  $redraw$$ && this.redraw()
};
ww.mode.HomeMode.prototype.onFrame = function $ww$mode$HomeMode$$onFrame$($delta$$) {
  ww.mode.HomeMode.superClass_.onFrame.call(this, $delta$$);
  this.deltaModifier_ = $delta$$ / 100;
  if(!0 == this.iClicked_) {
    this.iModifier_ < 1E4 * this.deltaModifier_ && !0 == this.iIncrement_ ? this.iModifier_ += 1E3 * this.deltaModifier_ : (1 < this.iMultiplier_ ? this.iModifier_ < 1E4 * this.deltaModifier_ && (this.iModifier_ += 100 * this.deltaModifier_) : (this.iIncrement_ = !1, this.iModifier_ -= 1E3 * this.deltaModifier_), this.iMultiplier_ = 1 < this.iMultiplier_ ? this.iMultiplier_ - 0.1 : 1);
    this.iModifier_ < 1E3 * this.deltaModifier_ && (this.iClicked_ = !1, this.iIncrement_ = !0, this.iMultiplier_ = 1);
    for(this.i_ = 0;this.i_ < this.paperI_.segments.length;this.i_++) {
      this.tempFloat = ww.util.floatComplexGaussianRandom(), this.paperI_.segments[this.i_].point._x = this.i_PointX[this.i_] + Math.cos(this.framesRendered_ / 10) * this.iModifier_ * this.iMultiplier_ * this.tempFloat[0], this.paperI_.segments[this.i_].point._y = this.i_PointY_[this.i_] + Math.sin(this.framesRendered_ / 10) * this.iModifier_ * this.iMultiplier_ * this.tempFloat[1]
    }
  }else {
    for(this.i_ = 0;this.i_ < this.paperO_.segments.length;this.i_++) {
      this.paperI_.segments[this.i_].point._x = this.i_PointX[this.i_], this.paperI_.segments[this.i_].point._y = this.i_PointY_[this.i_]
    }
  }
  if(!0 === this.oClicked_) {
    this.oModifier_ < 1E4 * this.deltaModifier_ && !0 === this.oIncrement_ ? this.oModifier_ += 1E3 * this.deltaModifier_ : (1 < this.oMultiplier_ ? this.oModifier_ < 1E4 * this.deltaModifier_ && (this.oModifier_ += 100 * this.deltaModifier_) : (this.oIncrement_ = !1, this.oModifier_ -= 1E3 * this.deltaModifier_), this.oMultiplier_ = 1 < this.oMultiplier_ ? this.oMultiplier_ - 0.1 : 1);
    this.oModifier_ < 1E3 * this.deltaModifier_ && (this.oClicked_ = !1, this.oIncrement_ = !0, this.oMultiplier_ = 1);
    this.delay_.feedback = this.oMultiplier_ / 10;
    for(this.i_ = 0;this.i_ < this.paperO_.segments.length;this.i_++) {
      this.tempFloat = ww.util.floatComplexGaussianRandom(), this.paperO_.segments[this.i_].handleIn._x = this.oHandleInX_[this.i_] + Math.cos(this.framesRendered_ / 10 * this.tempFloat[0]) * this.oModifier_ * this.oMultiplier_, this.paperO_.segments[this.i_].handleIn._y = this.oHandleInY_[this.i_] + Math.sin(this.framesRendered_ / 10 * this.tempFloat[0]) * this.oModifier_ * this.oMultiplier_, this.paperO_.segments[this.i_].handleOut._x = this.oHandleOutX_[this.i_] - Math.cos(this.framesRendered_ / 
      10 * this.tempFloat[0]) * this.oModifier_ * this.oMultiplier_, this.paperO_.segments[this.i_].handleOut._y = this.oHandleOutY_[this.i_] - Math.sin(this.framesRendered_ / 10 * this.tempFloat[0]) * this.oModifier_ * this.oMultiplier_, this.paperO_.segments[this.i_].point._x = this.oPointX_[this.i_] - Math.sin(this.framesRendered_ / 10 * this.tempFloat[0]) * this.oModifier_ * this.oMultiplier_, this.paperO_.segments[this.i_].point._y = this.oPointY_[this.i_] - Math.cos(this.framesRendered_ / 10 * 
      this.tempFloat[0]) * this.oModifier_ * this.oMultiplier_
    }
  }else {
    for(this.i_ = 0;this.i_ < this.paperO_.segments.length;this.i_++) {
      this.paperO_.segments[this.i_].handleIn._x = this.oHandleInX_[this.i_], this.paperO_.segments[this.i_].handleIn._y = this.oHandleInY_[this.i_], this.paperO_.segments[this.i_].handleOut._x = this.oHandleOutX_[this.i_], this.paperO_.segments[this.i_].handleOut._y = this.oHandleOutY_[this.i_], this.paperO_.segments[this.i_].point._x = this.oPointX_[this.i_], this.paperO_.segments[this.i_].point._y = this.oPointY_[this.i_]
    }
  }
};
ww.mode.SimoneMode = function $ww$mode$SimoneMode$() {
  ww.mode.Core.call(this, "simone", !0, !0)
};
goog.inherits(ww.mode.SimoneMode, ww.mode.Core);
ww.mode.SimoneMode.prototype.init = function $ww$mode$SimoneMode$$init$() {
  ww.mode.SimoneMode.superClass_.init.call(this);
  var $self$$ = this;
  TWEEN.removeAll();
  Modernizr.touch ? (this.evtStart = "touchstart.simon", this.evtEnd = "touchend.simon") : (this.evtStart = "mousedown.simon", this.evtEnd = "mouseup.simon");
  this.topLeft = $("#red");
  this.topRight = $("#green");
  this.bottomLeft = $("#blue");
  this.bottomRight = $("#yellow");
  this.segments = [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
  this.segmentEls = $("#red, #green, #blue, #yellow").css("opacity", 1);
  this.levelCount = $("#max-level").removeClass().text("");
  this.uiContainer = $("#levels").css("opacity", 0);
  this.container = $("#simone");
  this.message = $("#message").css("opacity", 1);
  this.playAgainEl = $("#play-again");
  this.container.bind(this.evtEnd, function() {
    $self$$.message.css("opacity", 0);
    $self$$.beginGame_();
    $self$$.container.unbind($self$$.evtEnd)
  });
  this.plays = 0;
  this.isAnimating = this.isPlaying = !1;
  this.highestLevel = this.lastStep = this.stepIndex = 0;
  this.generateSequence_();
  this.total = this.sequence.length;
  this.getAudioContext_();
  this.source = this.audioContext_.createOscillator();
  this.analyser = this.audioContext_.createAnalyser();
  this.analyser.fftSize = 512;
  this.analyser.smoothingTimeConstant = 0.85;
  this.notes = [{frequency:1806, detune:-3663, type:1}, {frequency:1806, detune:-4758, type:1}, {frequency:229, detune:1053, type:1}, {frequency:580, detune:-1137, type:2}]
};
ww.mode.SimoneMode.prototype.startCheck_ = function $ww$mode$SimoneMode$$startCheck_$($fadeInQuick_noteNum$$) {
  if(this.isPlaying && !this.isAnimating) {
    var $note$$ = this.notes[$fadeInQuick_noteNum$$], $segment$$ = this.segments[$fadeInQuick_noteNum$$], $self$$ = this;
    this.log("Playing note: ", $note$$);
    this.source.type = $note$$.type;
    this.source.frequency.value = $note$$.frequency;
    this.source.detune.value = $note$$.detune;
    $fadeInQuick_noteNum$$ = new TWEEN.Tween({opacity:0.5});
    $fadeInQuick_noteNum$$.to({opacity:1}, 100);
    $fadeInQuick_noteNum$$.onStart(function() {
      $self$$.source.connect($self$$.analyser);
      $self$$.analyser.connect($self$$.audioContext_.destination);
      $self$$.source.noteOn(0)
    });
    $fadeInQuick_noteNum$$.onUpdate(function() {
      $segment$$.css("opacity", this.opacity)
    });
    this.addTween($fadeInQuick_noteNum$$)
  }
};
ww.mode.SimoneMode.prototype.didFocus = function $ww$mode$SimoneMode$$didFocus$() {
  ww.mode.SimoneMode.superClass_.didFocus.call(this);
  var $self$$ = this;
  $self$$.playAgainEl.bind(this.evtEnd, function() {
    $self$$.beginGame_()
  });
  $self$$.topLeft.bind(this.evtStart, function() {
    $self$$.startCheck_(0)
  });
  $self$$.topLeft.bind(this.evtEnd, function() {
    $self$$.checkSequence_(0)
  });
  $self$$.topRight.bind(this.evtStart, function() {
    $self$$.startCheck_(1)
  });
  $self$$.topRight.bind(this.evtEnd, function() {
    $self$$.checkSequence_(1)
  });
  $self$$.bottomLeft.bind(this.evtStart, function() {
    $self$$.startCheck_(2)
  });
  $self$$.bottomLeft.bind(this.evtEnd, function() {
    $self$$.checkSequence_(2)
  });
  $self$$.bottomRight.bind(this.evtStart, function() {
    $self$$.startCheck_(3)
  });
  $self$$.bottomRight.bind(this.evtEnd, function() {
    $self$$.checkSequence_(3)
  })
};
ww.mode.SimoneMode.prototype.didUnfocus = function $ww$mode$SimoneMode$$didUnfocus$() {
  ww.mode.SimoneMode.superClass_.didUnfocus.call(this);
  this.playAgainEl.unbind(this.evtEnd);
  this.topLeft.unbind(this.evtStart);
  this.topRight.unbind(this.evtStart);
  this.bottomLeft.unbind(this.evtStart);
  this.bottomRight.unbind(this.evtStart);
  this.topLeft.unbind(this.evtEnd);
  this.topRight.unbind(this.evtEnd);
  this.bottomLeft.unbind(this.evtEnd);
  this.bottomRight.unbind(this.evtEnd)
};
ww.mode.SimoneMode.prototype.generateSequence_ = function $ww$mode$SimoneMode$$generateSequence_$() {
  this.sequence = this.sequence || [];
  for(var $i$$ = 0;4 > $i$$;$i$$++) {
    this.sequence.push(~~(4 * Math.random()))
  }
  this.log("generated sequence: " + this.sequence)
};
ww.mode.SimoneMode.prototype.shuffleSequence_ = function $ww$mode$SimoneMode$$shuffleSequence_$() {
  for(var $i$$ = this.sequence.length, $j$$, $swap$$;--$i$$;) {
    $j$$ = Math.random() * ($i$$ + 1) | 0, $swap$$ = this.sequence[$i$$], this.sequence[$i$$] = this.sequence[$j$$], this.sequence[$j$$] = $swap$$
  }
  this.log("shuffled sequence: " + this.sequence)
};
ww.mode.SimoneMode.prototype.checkSequence_ = function $ww$mode$SimoneMode$$checkSequence_$($fadeIn_guess_i$$) {
  this.log("Guessed (" + $fadeIn_guess_i$$ + ")");
  if(this.isPlaying && !this.isAnimating) {
    var $self$$ = this, $guessSeg$$ = $self$$.segments[$fadeIn_guess_i$$];
    $self$$.levelCount.removeClass();
    var $fadeOut$$ = new TWEEN.Tween({opacity:1});
    $fadeOut$$.to({opacity:0.5}, 200);
    $fadeOut$$.onUpdate(function() {
      $guessSeg$$.css("opacity", this.opacity)
    });
    $fadeOut$$.onComplete(function() {
      $self$$.source.disconnect()
    });
    $self$$.addTween($fadeOut$$);
    $self$$.isAnimating = !1;
    if($self$$.sequence[$self$$.stepIndex] === $fadeIn_guess_i$$) {
      if($self$$.log("Correct step guess."), $self$$.stepIndex !== $self$$.lastStep) {
        $self$$.stepIndex++
      }else {
        $self$$.log("Reached last step. Show next step.");
        $self$$.lastStep++;
        $self$$.levelCount.addClass("success");
        if($self$$.lastStep === $self$$.total) {
          for($fadeIn_guess_i$$ = 0;4 > $fadeIn_guess_i$$;$fadeIn_guess_i$$++) {
            $self$$.sequence.push(~~(4 * Math.random()))
          }
          $self$$.total += 4
        }
        $self$$.lastStep < $self$$.total && ($self$$.stepIndex = 0);
        $self$$.displayNext_()
      }
    }else {
      $self$$.log("Wrong. Expected (" + $self$$.sequence[$self$$.stepIndex] + ")"), $self$$.isPlaying = !1, $self$$.levelCount.addClass("game-over"), $fadeIn_guess_i$$ = new TWEEN.Tween({opacity:0.5}), $fadeIn_guess_i$$.to({opacity:1}, 200), $fadeIn_guess_i$$.delay(500), $fadeIn_guess_i$$.onUpdate(function() {
        $self$$.segmentEls.css("opacity", this.opacity)
      }), $self$$.addTween($fadeIn_guess_i$$)
    }
  }
};
ww.mode.SimoneMode.prototype.beginGame_ = function $ww$mode$SimoneMode$$beginGame_$() {
  if(!this.isPlaying) {
    var $self$$ = this;
    $self$$.plays++;
    $self$$.isPlaying = !0;
    $self$$.isAnimating = !1;
    $self$$.stepIndex = 0;
    $self$$.highestLevel = Math.max($self$$.highestLevel, $self$$.lastStep);
    $self$$.lastStep = 0;
    $self$$.shuffleSequence_();
    $self$$.levelCount.removeClass().text("");
    this.log("Playing sequence: " + this.sequence);
    $self$$.uiContainer.animate({opacity:1}, 200);
    if("0.5" !== $self$$.segmentEls.css("opacity")) {
      var $fadeOut$$ = new TWEEN.Tween({opacity:1});
      $fadeOut$$.to({opacity:0.5}, 200);
      $fadeOut$$.delay(200);
      $fadeOut$$.onUpdate(function() {
        $self$$.segmentEls.css("opacity", this.opacity)
      });
      $self$$.addTween($fadeOut$$)
    }
    $self$$.displayNext_()
  }
};
ww.mode.SimoneMode.prototype.displayNext_ = function $ww$mode$SimoneMode$$displayNext_$() {
  if(this.isPlaying) {
    this.isAnimating = !0;
    for(var $self$$ = this, $idx_segment$$, $note$$0$$, $stopIndex$$ = this.lastStep + 1, $delay$$0$$ = 500, $i$$0$$ = 0;$i$$0$$ < $stopIndex$$;$i$$0$$++) {
      $idx_segment$$ = $self$$.sequence[$i$$0$$], $note$$0$$ = $self$$.notes[$idx_segment$$], $idx_segment$$ = $self$$.segments[$idx_segment$$], $delay$$0$$ += 600, function($segment$$, $delay$$, $note$$, $i$$) {
        var $fadeIn$$ = new TWEEN.Tween({opacity:0.5});
        $fadeIn$$.to({opacity:1}, 200);
        $fadeIn$$.delay($delay$$);
        $fadeIn$$.onStart(function() {
          0 === $i$$ && $self$$.levelCount.removeClass("success");
          $self$$.log($i$$ + " now playing: ", $note$$);
          $self$$.source.type = $note$$.type;
          $self$$.source.frequency.value = $note$$.frequency;
          $self$$.source.detune.value = $note$$.detune;
          $self$$.source.connect($self$$.analyser);
          $self$$.analyser.connect($self$$.audioContext_.destination);
          $self$$.source.noteOn(0)
        });
        $fadeIn$$.onUpdate(function() {
          $segment$$[0].style.opacity = this.opacity
        });
        var $fadeOut$$ = new TWEEN.Tween({opacity:1});
        $fadeOut$$.to({opacity:0.5}, 200);
        $fadeOut$$.delay($delay$$ + 300);
        $fadeOut$$.onUpdate(function() {
          $segment$$[0].style.opacity = this.opacity
        });
        $fadeOut$$.onComplete(function() {
          $i$$ === $stopIndex$$ - 1 && ($self$$.isAnimating = !1, $self$$.levelCount.addClass("start").text($stopIndex$$));
          $self$$.source.disconnect()
        });
        $self$$.addTween($fadeIn$$);
        $self$$.addTween($fadeOut$$)
      }($idx_segment$$, $delay$$0$$, $note$$0$$, $i$$0$$)
    }
  }
};
ww.mode.ExplodeMode = function $ww$mode$ExplodeMode$() {
  ww.mode.Core.call(this, "explode", !0)
};
goog.inherits(ww.mode.ExplodeMode, ww.mode.Core);
ww.mode.ExplodeMode.prototype.init = function $ww$mode$ExplodeMode$$init$() {
  ww.mode.ExplodeMode.superClass_.init.call(this);
  $(document.body).css({backgroundImage:"url(../img/explode/1.gif)", backgroundRepeat:"no-repeat", "background-size":"100% 100%"});
  var $self$$ = this;
  setInterval(function() {
    $self$$.playSound("bomb.wav")
  }, 2E3)
};
ww.mode.SpaceMode = function $ww$mode$SpaceMode$() {
  ww.mode.Core.call(this, "space", !0, !1, !0);
  this.getAudioContext_();
  var $tuna$$ = new Tuna(this.audioContext_);
  this.delay = new $tuna$$.Delay({feedback:0, delayTime:0, wetLevel:0, dryLevel:0, cutoff:20, bypass:0});
  this.chorus = new $tuna$$.Chorus({rate:0.01, feedback:0.2, delay:0, bypass:0});
  this.currentPattern_ = "";
  this.maxPatternLength_ = 15
};
goog.inherits(ww.mode.SpaceMode, ww.mode.Core);
function pad($number$$, $length$$) {
  for(var $str$$ = "" + $number$$;$str$$.length < $length$$;) {
    $str$$ = "0" + $str$$
  }
  return $str$$
}
ww.mode.SpaceMode.prototype.playProcessedAudio = function $ww$mode$SpaceMode$$playProcessedAudio$($filename$$, $filter$$) {
  if(this.wantsAudio_) {
    var $url$$ = "../sounds/" + this.name_ + "/" + $filename$$;
    this.log('Requested sound "' + $filename$$ + '" from "' + $url$$ + '"');
    var $audioContext$$ = this.audioContext_;
    this.getSoundBufferFromURL_($url$$, function($buffer$$) {
      var $source$$ = $audioContext$$.createBufferSource();
      $source$$.buffer = $buffer$$;
      $source$$.connect($filter$$.input);
      $filter$$.connect($audioContext$$.destination);
      $source$$.noteOn(0)
    })
  }
};
ww.mode.SpaceMode.prototype.activateI = function $ww$mode$SpaceMode$$activateI$() {
  this.iClicked = !0;
  10 > this.iMultiplier && (this.iMultiplier += 2)
};
ww.mode.SpaceMode.prototype.activateO = function $ww$mode$SpaceMode$$activateO$() {
  this.oClicked = !0;
  10 > this.oMultiplier && (this.oMultiplier += 2)
};
ww.mode.SpaceMode.prototype.init = function $ww$mode$SpaceMode$$init$() {
  ww.mode.SpaceMode.superClass_.init.call(this);
  this.getPaperCanvas_();
  this.deltaModifier = 0;
  this.tempFloat = [];
  this.i = 0;
  this.screenCenterX = this.width_ / 2;
  this.screenCenterY = this.height_ / 2;
  this.mouseX = this.screenCenterX;
  this.mouseY = this.screenCenterY;
  this.lastClick = new paper.Point(this.screenCenterX, this.screenCenterY);
  this.world = this.getPhysicsWorld_();
  for(this.i = this.world.viscosity = 0;200 > this.i;this.i++) {
    this.tempFloat = ww.util.floatComplexGaussianRandom(), this.world.particles.push(new Particle(this.tempFloat[0] * this.width_, this.tempFloat[1] * this.height_)), this.world.particles[this.i].setRadius(Math.random(0.0277778 * this.width_)), this.world.particles[this.i].vel.x = 10, this.world.particles[this.i].vel.y = 0
  }
  this.iClicked = !1;
  this.iIncrement = !0;
  this.iModifier = 0;
  this.iMultiplier = 1;
  var $iWidth_slashEnd$$ = 0.175 * this.width_, $iHeight$$ = 2.12698413 * $iWidth_slashEnd$$, $iX$$ = this.screenCenterX - 1.5 * $iWidth_slashEnd$$, $iTopLeft$$1_oCenter$$ = new paper.Point($iX$$, this.screenCenterY - $iHeight$$ / 2), $iSize$$ = new paper.Size($iWidth_slashEnd$$, $iHeight$$);
  this.letterI = new paper.Rectangle($iTopLeft$$1_oCenter$$, $iSize$$);
  this.paperI = new paper.Path.Rectangle(this.letterI);
  this.paperI.fillColor = "#11a860";
  this.iPointX = [];
  this.iPointY = [];
  for(this.i = 0;this.i < this.paperI.segments.length;this.i++) {
    this.iPointX.push(this.paperI.segments[this.i].point._x), this.iPointY.push(this.paperI.segments[this.i].point._y)
  }
  this.oClicked = !1;
  this.oIncrement = !0;
  this.oModifier = 0;
  this.oMultiplier = 1;
  this.oRad = 0.1944444444 * this.width_;
  this.oScale = 1;
  $iTopLeft$$1_oCenter$$ = new paper.Point(this.screenCenterX + this.oRad, this.screenCenterY);
  this.paperO = new paper.Path.Circle($iTopLeft$$1_oCenter$$, this.oRad);
  this.paperO.fillColor = "#3777e2";
  this.oHandleInX = [];
  this.oHandleInY = [];
  this.oHandleOutX = [];
  this.oHandleOutY = [];
  this.oPointX = [];
  this.oPointY = [];
  for(this.i = 0;this.i < this.paperO.segments.length;this.i++) {
    this.oHandleInX.push(this.paperO.segments[this.i].handleIn._x), this.oHandleInY.push(this.paperO.segments[this.i].handleIn._y), this.oHandleOutX.push(this.paperO.segments[this.i].handleOut._x), this.oHandleOutY.push(this.paperO.segments[this.i].handleOut._y)
  }
  for(this.i = 0;this.i < this.paperO.segments.length;this.i++) {
    this.oPointX.push(this.paperO.segments[this.i].point._x), this.oPointY.push(this.paperO.segments[this.i].point._y)
  }
  $iTopLeft$$1_oCenter$$ = new paper.Point(this.screenCenterX + this.oRad / 8, this.screenCenterY - $iHeight$$ / 2 - 0.17475728 * 1.5 * $iHeight$$);
  $iWidth_slashEnd$$ = new paper.Point($iX$$ + $iWidth_slashEnd$$, this.screenCenterY + $iHeight$$ / 2 + 0.17475728 * 1.5 * $iHeight$$);
  this.paperSlash = new paper.Path;
  this.paperSlash.strokeWidth = 0.01388889 * this.width_;
  this.paperSlash.strokeColor = "#ebebeb";
  this.paperSlash.add($iTopLeft$$1_oCenter$$, $iWidth_slashEnd$$)
};
ww.mode.SpaceMode.prototype.didFocus = function $ww$mode$SpaceMode$$didFocus$() {
  ww.mode.SpaceMode.superClass_.didFocus.call(this);
  this.$canvas_ = $("#space-canvas");
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.canvas_.getContext("2d");
  var $self$$ = this, $evt$$ = Modernizr.touch ? "touchmove" : "mousemove";
  (new paper.Tool).onMouseDown = function $paper$Tool$onMouseDown$($event$$) {
    $self$$.lastClick = $event$$.point;
    $self$$.paperO.hitTest($event$$.point) && $self$$.activateO();
    $self$$.paperI.hitTest($event$$.point) && $self$$.activateI()
  };
  $(canvas).bind($evt$$, function($e$$) {
    $e$$.preventDefault();
    $e$$.stopPropagation();
    $self$$.mouseX = $e$$.pageX;
    $self$$.mouseY = $e$$.pageY
  })
};
ww.mode.SpaceMode.prototype.didUnfocus = function $ww$mode$SpaceMode$$didUnfocus$() {
  ww.mode.SpaceMode.superClass_.didUnfocus.call(this);
  var $canvas$$ = this.getPaperCanvas_(), $evt$$ = Modernizr.touch ? "touchmove" : "mousemove";
  $($canvas$$).unbind($evt$$)
};
ww.mode.SpaceMode.prototype.stepPhysics = function $ww$mode$SpaceMode$$stepPhysics$($delta$$) {
  ww.mode.SpaceMode.superClass_.stepPhysics.call(this, $delta$$);
  for(this.i = 0;this.i < this.world.particles.length;this.i++) {
    this.world.particles[this.i].pos.x += 1 + this.screenCenterX - this.mouseX, this.world.particles[this.i].pos.y += this.screenCenterY - this.mouseY
  }
};
ww.mode.SpaceMode.prototype.onFrame = function $ww$mode$SpaceMode$$onFrame$($delta$$) {
  ww.mode.SpaceMode.superClass_.onFrame.call(this, $delta$$);
  console.log("frame");
  if(this.canvas_) {
    this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1);
    this.ctx_.fillStyle = "#fff";
    this.ctx_.beginPath();
    for(this.i = 0;this.i < this.world.particles.length;this.i++) {
      this.ctx_.arc(this.world.particles[this.i].pos.x, this.world.particles[this.i].pos.y, this.world.particles[this.i].radius, 0, 2 * Math.PI), console.log(this.world.particles[this.i])
    }
    this.ctx_.fill()
  }
};
ww.mode.PinataMode = function $ww$mode$PinataMode$() {
  ww.mode.Core.call(this, "pinata", !0, !0, !1)
};
goog.inherits(ww.mode.PinataMode, ww.mode.Core);
ww.mode.PinataMode.prototype.init = function $ww$mode$PinataMode$$init$() {
  ww.mode.PinataMode.superClass_.init.call(this);
  this.COLORS_ = "#EB475A #E05A91 #925898 #E96641 #19A281 #FAD14A".split(" ");
  this.NUM_COLORS = this.COLORS_.length;
  this.prefix = Modernizr.prefixed("transform");
  this.centerX = window.innerWidth / 2;
  this.centerY = window.innerHeight / 2;
  this.scale = window.innerWidth / 30;
  this.getPaperCanvas_();
  if(this.active && this.active.length) {
    for(var $temp$$, $i$$ = 0, $l$$ = this.active.length;$i$$ < $l$$;$i$$++) {
      $temp$$ = this.active.pop(), $temp$$.fillColor = "rgba(255,255,255,0.01)", $temp$$.point = new paper.Point(this.centerX, this.centerY), $temp$$.position = $temp$$.point, this.deactive.push($temp$$)
    }
  }else {
    this.deactive = this.prepopulate(200), this.active = []
  }
  this.pinata = $("#pinata");
  this.pinata.css("opacity", "1");
  this.hitCount = 0;
  this.maxHit = 10
};
ww.mode.PinataMode.prototype.didFocus = function $ww$mode$PinataMode$$didFocus$() {
  ww.mode.PinataMode.superClass_.didFocus.call(this);
  var $self$$ = this;
  $self$$.pinata.bind((Modernizr.touch ? "touchend" : "mouseup") + ".pinata", function() {
    $self$$.popBalls_()
  })
};
ww.mode.PinataMode.prototype.didUnfocus = function $ww$mode$PinataMode$$didUnfocus$() {
  ww.mode.PinataMode.superClass_.didUnfocus.call(this);
  this.pinata.unbind((Modernizr.touch ? "touchend" : "mouseup") + ".pinata")
};
ww.mode.PinataMode.prototype.onResize = function $ww$mode$PinataMode$$onResize$($redraw$$) {
  ww.mode.PinataMode.superClass_.onResize.call(this, $redraw$$);
  this.centerX = window.innerWidth / 2;
  this.centerY = window.innerHeight / 2;
  this.scale = window.innerWidth / 30
};
ww.mode.PinataMode.prototype.onFrame = function $ww$mode$PinataMode$$onFrame$($delta$$7_length$$) {
  ww.mode.PinataMode.superClass_.onFrame.call(this, $delta$$7_length$$);
  $delta$$7_length$$ = this.active.length;
  for(var $size$$ = paper.view.size, $ball$$, $ballAndVect_max_pre$$, $i$$ = 0;$i$$ < $delta$$7_length$$;$i$$++) {
    $ball$$ = this.active[$i$$];
    $ball$$.vector.y += $ball$$.gravity;
    $ball$$.vector.x *= 0.99;
    $ballAndVect_max_pre$$ = this.utilAdd_($ball$$.point, $ball$$.vector);
    if($ballAndVect_max_pre$$.x < $ball$$.radius || $ballAndVect_max_pre$$.x > $size$$.width - $ball$$.radius) {
      $ball$$.vector.x *= -1 * $ball$$.dampen
    }
    if($ballAndVect_max_pre$$.y < $ball$$.radius || $ballAndVect_max_pre$$.y > $size$$.height - $ball$$.radius) {
      3 > Math.abs($ball$$.vector.x) && ($ball$$.vector = paper.Point.random(), $ball$$.vector = this.utilAdd_($ball$$.vector, [-0.5, 0]), $ball$$.vector = this.utilMultiply_($ball$$.vector, [50, 100])), $ball$$.vector.y *= $ball$$.bounce
    }
    $ballAndVect_max_pre$$ = this.utilAdd_($ball$$.point, $ball$$.vector);
    $ballAndVect_max_pre$$ = paper.Point.max($ball$$.radius, $ballAndVect_max_pre$$);
    $ball$$.point = paper.Point.min($ballAndVect_max_pre$$, $size$$.width - $ball$$.radius);
    $ball$$.position = $ball$$.point;
    $ball$$.rotate($ball$$.vector.x / 2)
  }
};
ww.mode.PinataMode.prototype.utilAdd_ = function $ww$mode$PinataMode$$utilAdd_$($v1$$, $v2$$) {
  var $result$$ = {};
  $result$$.x = ($v1$$.x || $v1$$[0]) + ($v2$$.x || $v2$$[0]);
  $result$$.y = ($v1$$.y || $v1$$[1]) + ($v2$$.y || $v2$$[1]);
  return $result$$
};
ww.mode.PinataMode.prototype.utilMultiply_ = function $ww$mode$PinataMode$$utilMultiply_$($v1$$, $v2$$) {
  var $result$$ = {};
  $result$$.x = ($v1$$.x || $v1$$[0]) * ($v2$$.x || $v2$$[0]);
  $result$$.y = ($v1$$.y || $v1$$[1]) * ($v2$$.y || $v2$$[1]);
  return $result$$
};
ww.mode.PinataMode.prototype.prepopulate_ = function $ww$mode$PinataMode$$prepopulate_$($max$$) {
  for(var $balls$$ = [], $i$$ = 0;$i$$ < $max$$;$i$$++) {
    point = new paper.Point(this.centerX, this.centerY), radius = this.scale * Math.random() + 10, ball = new paper.Path.Circle(point, radius), ball.point = point, ball.fillColor = "rgba(255,255,255,0.01)", ball.vector = paper.Point.random(), ball.vector = this.utilAdd_(ball.vector, [-0.5, 0]), ball.vector = this.utilMultiply_(ball.vector, [50, 100]), ball.dampen = 0.4, ball.gravity = 3, ball.bounce = -0.6, ball.radius = radius, $balls$$.push(ball)
  }
  return $balls$$
};
ww.mode.PinataMode.prototype.popBalls_ = function $ww$mode$PinataMode$$popBalls_$() {
  var $ball$$, $toPop_wiggleTwo$$, $self$$ = this;
  this.playSound("whack.mp3");
  if(this.hitCount < this.maxHit) {
    this.hitCount++;
    $toPop_wiggleTwo$$ = Math.min(this.deactive.length, ~~Random(1, 5) * this.hitCount);
    this.log("hit #" + this.hitCount + ". adding " + $toPop_wiggleTwo$$ + " more balls.");
    for(var $deg_i$$ = 0;$deg_i$$ < $toPop_wiggleTwo$$;$deg_i$$++) {
      $ball$$ = this.deactive.pop(), $ball$$.fillColor = this.COLORS_[~~Random(0, this.NUM_COLORS)], this.active.push($ball$$)
    }
    var $deg_i$$ = ~~Random(10, 45), $dir$$ = 0 === this.hitCount % 2 ? -1 : 1;
    $ball$$ = (new TWEEN.Tween({deg:0})).to({deg:$dir$$ * $deg_i$$}, 150).onUpdate(function() {
      $self$$.pinata[0].style[$self$$.prefix] = "rotate(" + this.deg + "deg)"
    });
    $toPop_wiggleTwo$$ = (new TWEEN.Tween({deg:$dir$$ * $deg_i$$})).to({deg:-1 * $dir$$ * $deg_i$$}, 150).delay(150).onUpdate(function() {
      $self$$.pinata[0].style[$self$$.prefix] = "rotate(" + this.deg + "deg)"
    });
    $deg_i$$ = (new TWEEN.Tween({deg:-1 * $dir$$ * $deg_i$$})).to({deg:0}, 150).delay(300).onUpdate(function() {
      $self$$.pinata[0].style[$self$$.prefix] = "rotate(" + this.deg + "deg)"
    });
    $self$$.addTween($ball$$);
    $self$$.addTween($toPop_wiggleTwo$$);
    $self$$.addTween($deg_i$$)
  }else {
    this.log("reached max hits. pinata game over. " + this.deactive.length + " balls remaining.")
  }
};
var TWOPI = 2 * Math.PI;
ww.mode.PongMode = function $ww$mode$PongMode$() {
  this.startBallSpeed_ = this.ballSpeed_ = 250;
  this.maxBallSpeed_ = 800;
  this.startBallRadius_ = this.ballRadius_ = 30;
  this.minBallRadius_ = 10;
  this.paddleX_ = 40;
  this.paddleY_ = 80;
  this.paddleWidth_ = 40;
  this.paddleHeight_ = 160;
  this.bottomWallOpacity_ = this.rightWallOpacity_ = this.topWallOpacity_ = 0;
  ww.mode.Core.call(this, "pong", !0, !0, !0)
};
goog.inherits(ww.mode.PongMode, ww.mode.Core);
ww.mode.PongMode.prototype.init = function $ww$mode$PongMode$$init$() {
  ww.mode.PongMode.superClass_.init.call(this);
  var $world$$ = this.getPhysicsWorld_();
  $world$$.viscosity = 0;
  this.ball_ = this.ball_ || new Particle;
  $world$$.particles.push(this.ball_);
  this.screenCenterX = this.width_ / 2;
  this.screenCenterY = this.height_ / 2;
  this.mouseX_ = this.screenCenterX;
  this.mouseY_ = this.screenCenterY;
  this.paddleY_ = this.mouseY_ - this.paddleHeight_ / 2;
  this.resetGame_()
};
ww.mode.PongMode.prototype.resetGame_ = function $ww$mode$PongMode$$resetGame_$() {
  this.setScore_(0);
  this.bottomWallOpacity_ = this.rightWallOpacity_ = this.topWallOpacity_ = 0;
  this.ballRadius_ = this.startBallRadius_;
  this.ballSpeed_ = this.startBallSpeed_;
  this.startXBall_ = this.screenCenterX + this.width_ / 4;
  this.ball_.setRadius(this.ballRadius_);
  this.ball_.pos.x = this.startXBall_;
  this.ball_.pos.y = this.ballRadius_;
  this.ball_.vel.x = -this.ballSpeed_;
  this.ball_.vel.y = this.ballSpeed_
};
ww.mode.PongMode.prototype.onResize = function $ww$mode$PongMode$$onResize$($redraw$$) {
  ww.mode.PongMode.superClass_.onResize.call(this, !1);
  this.canvas_ && (this.canvas_.width = this.width_, this.canvas_.height = this.height_);
  $redraw$$ && this.redraw()
};
ww.mode.PongMode.prototype.didFocus = function $ww$mode$PongMode$$didFocus$() {
  ww.mode.PongMode.superClass_.didFocus.call(this);
  this.$score_ = $("#score");
  this.$canvas_ = $("#pong-canvas");
  this.canvas_ = this.$canvas_[0];
  this.canvas_.width = this.width_;
  this.canvas_.height = this.height_;
  this.ctx_ = this.canvas_.getContext("2d");
  var $self$$ = this;
  this.$canvas_.bind((Modernizr.touch ? "touchmove" : "mousemove") + ".pong", function($e$$) {
    $e$$.preventDefault();
    $e$$.stopPropagation();
    $self$$.mouseX_ = $e$$.pageX;
    $self$$.mouseY_ = $e$$.pageY
  })
};
ww.mode.PongMode.prototype.didUnfocus = function $ww$mode$PongMode$$didUnfocus$() {
  ww.mode.PongMode.superClass_.didUnfocus.call(this);
  this.$canvas_.unbind((Modernizr.touch ? "touchmove" : "mousemove") + ".pong")
};
ww.mode.PongMode.prototype.hitWall_ = function $ww$mode$PongMode$$hitWall_$($inToParams_wall$$) {
  this.playSound("1.wav");
  var $key$$ = $inToParams_wall$$ + "Opacity_", $fadeInTween_inFromParams$$ = {};
  $fadeInTween_inFromParams$$[$key$$] = this[$key$$];
  $inToParams_wall$$ = {};
  $inToParams_wall$$[$key$$] = 1;
  var $self$$ = this, $fadeInTween_inFromParams$$ = new TWEEN.Tween($fadeInTween_inFromParams$$);
  $fadeInTween_inFromParams$$.to($inToParams_wall$$, 200);
  $fadeInTween_inFromParams$$.onUpdate(function() {
    $self$$[$key$$] = this[$key$$]
  });
  this.addTween($fadeInTween_inFromParams$$)
};
ww.mode.PongMode.prototype.hitPaddle_ = function $ww$mode$PongMode$$hitPaddle_$() {
  this.playSound("2.wav");
  var $fadeOutTween_newScore$$ = this.score_ + 1;
  0 < this.topWallOpacity_ && (0 < this.rightWallOpacity_ && 0 < this.bottomWallOpacity_) && ($fadeOutTween_newScore$$ += 3);
  this.setScore_($fadeOutTween_newScore$$);
  var $self$$ = this, $fadeOutTween_newScore$$ = new TWEEN.Tween({topWallOpacity:this.topWallOpacity_, rightWallOpacity:this.rightWallOpacity_, bottomWallOpacity:this.bottomWallOpacity_});
  $fadeOutTween_newScore$$.to({topWallOpacity:0, rightWallOpacity:0, bottomWallOpacity:0}, 200);
  $fadeOutTween_newScore$$.onUpdate(function() {
    $self$$.topWallOpacity_ = this.topWallOpacity;
    $self$$.rightWallOpacity_ = this.rightWallOpacity;
    $self$$.bottomWallOpacity_ = this.bottomWallOpacity
  });
  this.addTween($fadeOutTween_newScore$$)
};
ww.mode.PongMode.prototype.gameOver_ = function $ww$mode$PongMode$$gameOver_$() {
  this.log("You Lose");
  this.showReload()
};
ww.mode.PongMode.prototype.setScore_ = function $ww$mode$PongMode$$setScore_$($val$$) {
  this.score_ = $val$$;
  this.$score_ && this.$score_.length && this.$score_.text(this.score_)
};
ww.mode.PongMode.prototype.reflectBall_ = function $ww$mode$PongMode$$reflectBall_$() {
  this.ball_.pos.x <= this.ball_.radius && this.gameOver_();
  0 < this.ball_.vel.x && this.ball_.pos.x >= this.width_ - this.ball_.radius && (this.ball_.vel.x *= -1, this.hitWall_("rightWall"));
  0 < this.ball_.vel.y && this.ball_.pos.y >= this.height_ - this.ball_.radius && (this.ball_.vel.y *= -1, this.hitWall_("bottomWall"));
  0 > this.ball_.vel.y && this.ball_.pos.y <= this.ball_.radius && (this.ball_.vel.y *= -1, this.hitWall_("topWall"));
  var $mag_paddleTop$$ = this.paddleY_ - this.paddleHeight_ / 2, $paddleBottom$$ = this.paddleY_ + this.paddleHeight_ / 2;
  0 > this.ball_.vel.x && (this.ball_.pos.x <= this.paddleX_ + this.paddleWidth_ / 2 + this.ball_.radius && this.ball_.pos.y >= $mag_paddleTop$$ && this.ball_.pos.y <= $paddleBottom$$) && (this.ball_.vel.x *= -1, $mag_paddleTop$$ = this.ball_.vel.mag(), this.norm_ ? this.norm_.copy(this.ball_.vel) : this.norm_ = this.ball_.vel.clone(), this.norm_.norm(), this.changeVec_ = this.changeVec_ || new Vector, this.changeVec_.set(0, (this.ball_.pos.y - this.paddleY_) / (this.paddleHeight_ / 2)), this.norm_.add(this.changeVec_), 
  this.norm_.norm(), this.norm_.scale($mag_paddleTop$$), this.ball_.vel.copy(this.norm_), this.hitPaddle_())
};
ww.mode.PongMode.prototype.stepPhysics = function $ww$mode$PongMode$$stepPhysics$($delta$$) {
  ww.mode.PongMode.superClass_.stepPhysics.call(this, $delta$$);
  var $currentPaddleY$$ = this.paddleY_, $targetPaddleY$$ = this.mouseY_;
  $targetPaddleY$$ < this.paddleHeight_ / 2 ? $targetPaddleY$$ = this.paddleHeight_ / 2 : $targetPaddleY$$ > this.height_ - this.paddleHeight_ / 2 && ($targetPaddleY$$ = this.height_ - this.paddleHeight_ / 2);
  this.paddleY_ = $currentPaddleY$$ + 0.5 * ($targetPaddleY$$ - $currentPaddleY$$) * 10 * $delta$$;
  0 < this.ball_.vel.x && (this.ballRadius_ >= this.minBallRadius_ && (this.ballRadius_ *= 0.9995, this.ball_.setRadius(this.ballRadius_)), this.ballSpeed_ <= this.maxBallSpeed_ && (this.ballSpeed_ *= 1.001, this.ball_.vel.x = 0 > this.ball_.vel.x ? -this.ballSpeed_ : this.ballSpeed_, this.ball_.vel.y = 0 > this.ball_.vel.y ? -this.ballSpeed_ : this.ballSpeed_));
  this.reflectBall_()
};
ww.mode.PongMode.prototype.onFrame = function $ww$mode$PongMode$$onFrame$($delta$$) {
  ww.mode.PongMode.superClass_.onFrame.call(this, $delta$$);
  this.canvas_ && (this.ctx_.clearRect(0, 0, this.canvas_.width + 1, this.canvas_.height + 1), this.ctx_.fillStyle = "#e0493e", this.ctx_.beginPath(), this.ctx_.arc(this.ball_.pos.x, this.ball_.pos.y, this.ball_.radius, 0, TWOPI), this.ctx_.fill(), this.ctx_.fillStyle = "#d0d0d0", this.ctx_.fillRect(this.paddleX_ - this.paddleWidth_ / 2, this.paddleY_ - this.paddleHeight_ / 2, this.paddleWidth_, this.paddleHeight_), this.ctx_.fillStyle = "#f3cdca", 0 < this.topWallOpacity_ && (this.ctx_.save(), this.ctx_.globalAlpha = 
  this.topWallOpacity_, this.ctx_.fillRect(0, 0, this.width_, 10), this.ctx_.restore()), 0 < this.bottomWallOpacity_ && (this.ctx_.save(), this.ctx_.globalAlpha = this.bottomWallOpacity_, this.ctx_.fillRect(0, this.height_ - 10, this.width_, 10), this.ctx_.restore()), 0 < this.rightWallOpacity_ && (this.ctx_.save(), this.ctx_.globalAlpha = this.rightWallOpacity_, this.ctx_.fillRect(this.width_ - 10, 0, 10, this.height_), this.ctx_.restore()))
};
var DEBUG_MODE = !0;
ww.mode.modes = {};
ww.mode.register = function $ww$mode$register$($name$$, $klass$$, $pattern$$, $len$$) {
  ww.mode.modes[$name$$] = {klass:$klass$$, pattern:$pattern$$, len:$len$$}
};
ww.mode.findModeByName = function $ww$mode$findModeByName$($name$$) {
  return ww.mode.modes[$name$$]
};
ww.mode.register("bacon", ww.mode.BaconMode, 7, 4);
ww.mode.register("cat", ww.mode.CatMode, 2, 4);
ww.mode.register("explode", ww.mode.ExplodeMode, 5, 4);
ww.mode.register("home", ww.mode.HomeMode, null);
ww.mode.register("pinata", ww.mode.PinataMode, 6, 4);
ww.mode.register("pong", ww.mode.PongMode, 4, 4);
ww.mode.register("simone", ww.mode.SimoneMode, 8, 4);
ww.mode.register("space", ww.mode.SpaceMode, 3, 4);
jQuery(function() {
  var $parts$$ = window.location.href.split("/"), $parts$$ = $parts$$[$parts$$.length - 1].replace("_test.html", ".html").replace(/\.html(.*)/, "");
  new (ww.mode.findModeByName($parts$$).klass)
});

