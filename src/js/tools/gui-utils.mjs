/*
 * Copyright (C) 2020 Tobias Briones. All rights reserved.
 *
 * This file is part of Example Project: Machine Replacement Model.
 *
 * Machine Replacement Model is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Machine Replacement Model is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Machine Replacement Model.  If not, see <https://www.gnu.org/licenses/>.
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
