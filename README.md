# react-pdf-js

`react-pdf-js` provides a component for rendering PDF documents using [PDF.js](http://mozilla.github.io/pdf.js/). Written for React 15/16 and ES2015 using the Airbnb style guide.

---

[![NPM Version](https://img.shields.io/npm/v/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![NPM Downloads](https://img.shields.io/npm/dm/react-pdf-js.svg?style=flat-square)](https://www.npmjs.com/package/react-pdf-js)
[![Build Status](https://img.shields.io/travis/mikecousins/react-pdf-js/master.svg?style=flat-square)](https://travis-ci.org/mikecousins/react-pdf-js)
[![Dependency Status](https://david-dm.org/mikecousins/react-pdf-js.svg)](https://david-dm.org/mikecousins/react-pdf-js)
[![devDependency Status](https://david-dm.org/mikecousins/react-pdf-js/dev-status.svg)](https://david-dm.org/mikecousins/react-pdf-js#info=devDependencies)

## Demo

http://mikecousins.github.io/react-pdf-js/

## Usage

Install with `yarn add react-pdf-js` or `npm install react-pdf-js`

Use it in your app (showing some basic pagination as well):

```js
import React from 'react';
import PDF from 'react-pdf-js';

class MyPdfViewer extends React.Component {
  state = {};

  onDocumentComplete = (pages) => {
    this.setState({ page: 1, pages });
  }

  handlePrevious = () => {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext = () => {
    this.setState({ page: this.state.page + 1 });
  }

  renderPagination = (page, pages) => {
    let previousButton = <li className="previous" onClick={this.handlePrevious}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    if (page === 1) {
      previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
    }
    let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    if (page === pages) {
      nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
    }
    return (
      <nav>
        <ul className="pager">
          {previousButton}
          {nextButton}
        </ul>
      </nav>
      );
  }

  render() {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div>
        <PDF
          file="test.pdf"
          onDocumentComplete={this.onDocumentComplete}
          page={this.state.page}
          {/* pass in a containerRef prop which is a react ref for the pdf to scale into the container  */}
        />
        {pagination}
      </div>
    )
  }
}

export default MyPdfViewer;
```

## License

MIT © [mikecousins](https://github.com/mikecousins)
