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

const passSymbol = '\u2714';
const failSymbol = '\u2718';

export function it(description, fn) {
  try {
    fn();
    console.log('\x1b[32m%s\x1b[0m', `${ passSymbol } ${ description }`);
  }
  catch (e) {
    console.log();
    console.log('\x1b[31m%s\x1b[0m', `${ failSymbol } ${ description }`);
    console.log(e);
    console.log();
  }
}

export function assert(isTrue) {
  if (!isTrue) {
    throw new Error();
  }
}

export function expectToThrowError(fn) {
  let functionThrewError = false;

  try {
    fn();
  }
  catch (ignore) {
    functionThrewError = true;
  }
  if (!functionThrewError) {
    throw new Error();
  }
}
