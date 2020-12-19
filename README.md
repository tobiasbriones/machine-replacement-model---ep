# Example Project: Machine Replacement Model

[![License](https://img.shields.io/github/license/TobiasBriones/example.math.or.model.web.machine_replacement)](https://github.com/TobiasBriones/example.math.or.model.web.machine_replacement/blob/master/LICENSE)

Example project for solving Operations Research machine maintenance/replacement models. This app was a sample created in pure JS and Bootstrap.

## Notes

- This tool/example-project was superseded by [2DP Repsymo Solver](https://github.com/TobiasBriones/2dp-repsymo-solver)
  which is a complete web application that solves several models of dynamic programming.
  
- In the solutions tree you have a pair (K, R) that indicates an imaginary arrow if you take either Keep (**K**) or 
  Replace (**R**) from that node, e.g. in the screenshot example if you are in the decision year #2 and your machine has 4 years, if you choose **K** then the arrow goes from that node to the node with the value of 5 in the next decision year, if you choose **R** then the arrow goes to the node with the value of 1 in the next decision year.
  
- More unit tests can be added to the source code, I only tested the machine-replacement module.

- In the solutions tree, the last decision year on the abscissa does not appear because I considered it was not necessary to plot it for this project.

- By default, the example found in Taha's book from the machine replacement section comes set with this app. Moreover, you might find that the example in the book has an error in the decision for the stage 3 with t = 5!

## Getting started

Run [index.html](./src/index.html) on an HTTP server to serve the app. 

Run [index.test.html](./src/index.test.html) on an HTTP server to execute the tests. 

## Screenshots

[![Screenshot 1](https://raw.githubusercontent.com/TobiasBriones/images/master/example-projects/example.math.or.model.web.machine-replacement/screenshot-1.png)](https://github.com/TobiasBriones/images/tree/master/example-projects)

## Contact

This software: [App](https://tobiasbriones.github.io/example.math.or.model.web.machine-replacement/)
, [GitHub Repository](https://github.com/TobiasBriones/example.math.or.model.web.machine-replacement)

Tobias Briones: [GitHub](https://github.com/TobiasBriones)

Example Project: [App](https://tobiasbriones.github.io/example-project/)

2DP Repsymo Solver: [GitHub Repository](https://github.com/TobiasBriones/2dp-repsymo-solver)

## About

**Example Project: Machine Replacement Model**

Example project for solving Operations Research machine maintenance/replacement models. This app was superseded by 
2DP Repsymo Solver.

Copyright © 2019-2020 Tobias Briones. All rights reserved.

### License

This software is licensed under
the [GNU General Public License v3.0 or later License](https://github.com/TobiasBriones/example.math.or.model.web.machine-replacement/blob/master/LICENSE).
