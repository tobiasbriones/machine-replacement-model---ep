# Example Project: Machine Replacement Model
[![License](https://img.shields.io/github/license/TobiasBriones/example.math.or.model.web.machine_replacement)](https://github.com/TobiasBriones/example.math.or.model.web.machine_replacement/blob/master/LICENSE)

Operations research model for machine maintenance/replacement. This app was a sample created in pure JS and Boostrap and it was replaced by 2DP RepSyMo Solver https://github.com/TobiasBriones/2dp-repsymo-solver which is a complete web application that solves several models of dynamic programming.

## Notes
- This tool/example-project was replaced by [2DP Repsymo Solver](https://github.com/TobiasBriones/2dp-repsymo-solver)
- In the solutions tree you have a pair (K, R) that indicates an imaginary arrow if you take either Keep (**K**) or Replace (**R**) from that node, e.g. in the screenshot example if you are in the decision year #2 and your machine has 4 years, if you choose **K** then the arrow goes from that node to the node with the value of 5 in the next decision year, if you choose **R** then the arrow goes to the node with the value of 1 in the next decision year
- In the result chains the last one is extra, it shouldn't appear

[![Screenshot 1](https://raw.githubusercontent.com/TobiasBriones/images/master/example-projects/example.math.or.model.web.machine-replacement/screenshot-1.png)](https://github.com/TobiasBriones/images/tree/master/example-projects)

## License
Example Project: Machine Replacement Model

Copyright © 2019-2020 Tobias Briones. All rights reserved.

This software is licensed under the [GNU General Public License v3.0 or later License](https://github.com/TobiasBriones/example.math.or.model.web.machine-replacement/blob/master/LICENSE).
