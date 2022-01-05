/*
 * Copyright (c) 2020 Tobias Briones. All rights reserved.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Example Project: Machine Replacement Model.
 *
 * This source code is licensed under the GNU General Public License v3.0 or
 * later License found in the LICENSE file in the root directory of this source
 * tree or at https://opensource.org/licenses/GPL-3.0.
 */

export function getSpanEl(text) {
  const el = document.createElement('span');

  el.innerText = text;
  return el;
}

export function deepCopyOf(el) {
  return el.cloneNode(true);
}

export function clear(el) {
  while (el.lastElementChild) {
    el.removeChild(el.lastElementChild);
  }
}
