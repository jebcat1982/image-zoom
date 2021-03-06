// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Factory class to create a simple autocomplete that will match
 * from an array of data.
 *
 * @see ../../demos/autocomplete-basic.html
 */

// TODO(user): Remove this file completely after known usages are replaced
// with goog.ui.ac.createSimpleAutoComplete.
goog.provide('goog.ui.AutoComplete.Basic');

goog.require('goog.ui.AutoComplete');
goog.require('goog.ui.ac.ArrayMatcher');
goog.require('goog.ui.ac.AutoComplete');
goog.require('goog.ui.ac.InputHandler');
goog.require('goog.ui.ac.Renderer');



/**
 * Factory class for building a basic autocomplete widget that autocompletes
 * an inputbox or text area from a data array.
 * @param {Array} data Data array.
 * @param {Element} input Input element or text area.
 * @param {boolean=} opt_multi Whether to allow multiple entries separated with
 * semi-colons or commas.
 * @param {boolean=} opt_useSimilar use similar matches. e.g. "gost" => "ghost".
 * @constructor
 * @extends {goog.ui.ac.AutoComplete}
 * @deprecated Use {@link goog.ui.ac.createSimpleAutoComplete} instead.
 */
goog.ui.AutoComplete.Basic = function(data, input, opt_multi, opt_useSimilar) {
  var matcher = new goog.ui.ac.ArrayMatcher(data, !opt_useSimilar);
  var renderer = new goog.ui.ac.Renderer();
  var inputHandler = new goog.ui.ac.InputHandler(null, null, !!opt_multi);

  goog.ui.ac.AutoComplete.call(this, matcher, renderer, inputHandler);

  inputHandler.attachAutoComplete(this);
  inputHandler.attachInputs(input);
};
goog.inherits(goog.ui.AutoComplete.Basic, goog.ui.ac.AutoComplete);
