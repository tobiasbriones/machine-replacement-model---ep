# Example Project: Machine Replacement Model

[![Project](https://raw.githubusercontent.com/tobiasbriones/ep-machine-replacement-model/static/badge.svg)](https://dev.mathsoftware.engineer/ep-machine-replacement-model/)
&nbsp;
[![GitHub Repository](https://raw.githubusercontent.com/tobiasbriones/static/main/gh-badge.svg)](https://github.com/tobiasbriones/ep-machine-replacement-model)

[![GitHub Project License](https://img.shields.io/github/license/tobiasbriones/ep-machine-replacement-model.svg?style=flat-square)](https://github.com/tobiasbriones/ep-machine-replacement-model/blob/main/LICENSE)

Example project app for solving Operations Research's machine
maintenance/replacement models.

This app was a sample created in pure JS and Bootstrap.

## Getting Started

Run [index.html](./src/index.html) on an HTTP server to serve the app.

Run [index.test.html](./src/index.test.html) on an HTTP server to execute the
tests.

Go to: [App](https://machine-replacement-model.ep.dev.mathsoftware.engineer)

## Notes

- This tool/example-project was superseded
  by [2DP Repsymo Solver](https://github.com/repsymo/2dp-repsymo-solver)
  which is a complete web application that solves several models of dynamic
  programming.

- In the solutions tree, you have a pair (K, R) that indicates an imaginary
  arrow if you take either Keep (**K**) or Replace (**R**) from that node, e.g.
  in the screenshot example if you are in decision year #2, and your machine has
  4 years, if you choose **K** then the arrow goes from that node to the node
  with the value of 5 in the next decision year, if you choose **R** then the
  arrow goes to the node with the value of 1 in the next decision year.

- More unit tests can be added to the source code, I only tested the
  machine-replacement module.

- In the solutions tree, the last decision year on the abscissa does not appear
  because I considered it was not necessary to plot it for this project.

- By default, the example found in Taha's book from the machine replacement
  section comes set with this app. Moreover, you might find that the example in
  the book has an error in the decision for stage 3 with t = 5!

- The [samples module](src/model/machine-replacement-samples.mjs) also has an
  example from
  [this source (AARF paper)](https://www.mbsresearch.com/files/journals/2017/July/_current_2017_Aug_BIJuMqzmjVgbate.pdf)
  . The default sample to show in the app can be set in the MainPage
  constructor. The default sample is Taha's example, so you can opt to set the
  other sample to check it out too.

I've checked out several problems/exercises from papers or resources on the
internet, and it's incredible how wrong they are and how much time those
mistakes take away from us, the readers. I've found horrible mistakes related to
copy-paste, numeric computation (all the values from the beginning), and minor
mistakes like printing a wrong character in the best of the cases. So it's quite
easy to spot those huge or minor mistakes by using the application to compute
the right solutions. No one would've noticed those mistakes if it wasn't for the
application. I, fortunately, have the solver application! The solver
app/software is a must in most situations to verify the solutions to our
problems.

## Screenshots

![Screenshot 1](https://github.com/tobiasbriones/ep-machine-replacement-model/releases/download/v1.1.0/screenshot-1.png)

## Contact

Tobias Briones: [GitHub](https://github.com/tobiasbriones)

2DP Repsymo Solver: [Home](https://repsymo.com),
[GitHub Repository](https://github.com/repsymo/2dp-repsymo-solver)

## About

**Example Project: Machine Replacement Model**

Example project app for solving Operations Research's machine
maintenance/replacement models.

Copyright © 2019-2022 Tobias Briones. All rights reserved.

### License

This project is licensed under
the [GNU General Public License v3.0 or later License](./LICENSE).
