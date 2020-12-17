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

const passSymbol = '\u2714';
const failSymbol = '\u2718 ';

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
