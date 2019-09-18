/**
 * @class ReactPdfJs
 */
import PdfJsLib from 'pdfjs-dist';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ReactPdfJs extends Component {
  static propTypes = {
    file: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    page: PropTypes.number,
    onDocumentComplete: PropTypes.func,
    scale: PropTypes.number,
    cMapUrl: PropTypes.string,
    cMapPacked: PropTypes.bool,
    className: PropTypes.string,
    containerRef: PropTypes.elementType,
  }

  static defaultProps = {
    page: 1,
    onDocumentComplete: null,
    scale: 1,
    cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    cMapPacked: false,
    containerRef: {},
  }

  state = {
    pdf: null,
  };

  componentDidMount() {
    const {
      file,
      onDocumentComplete,
      page,
      cMapUrl,
      cMapPacked,
    } = this.props;
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';
    PdfJsLib.getDocument({ url: file, cMapUrl, cMapPacked }).then((pdf) => {
      this.setState({ pdf });
      if (onDocumentComplete) {
        onDocumentComplete(pdf._pdfInfo.numPages); // eslint-disable-line
      }
      pdf.getPage(page).then(p => this.drawPDF(p));
    });
  }

  componentWillReceiveProps(newProps) {
    const { page, scale } = this.props;
    const { pdf } = this.state;

    if (newProps.page !== page) {
      pdf.getPage(newProps.page).then(p => this.drawPDF(p));
    }
    if (newProps.scale !== scale) {
      pdf.getPage(newProps.page).then(p => this.drawPDF(p));
    }
  }

  getMaxScale = (page) => {
    const viewport = page.getViewport(1);
    const container = this.props.containerRef.current;

    const sizes = {
      container: {
        width: container.offsetWidth,
        height: container.clientHeight,
      },
      canvas: {
        width:viewport.width,
        height:viewport.height,
      },
    };

    const viewportRatio = sizes.canvas.width / sizes.canvas.height;
    const containerRatio = sizes.container.width / sizes.container.height;

    let requiredScale = 1;

    if (viewportRatio > containerRatio) {
      // canvas is wider than container -> scale according to width
      requiredScale = (sizes.container.width / sizes.canvas.width);
    } else {
      // container is wider than cavas -> scale according to height
      requiredScale = (sizes.container.height / sizes.canvas.height);
    }

    return requiredScale;
  }

  drawPDF = (page) => {
    let { scale } = this.props;
    if (this.props.containerRef.current) {
      scale = this.getMaxScale(page);
    }
    const viewport = page.getViewport(scale);
    const { canvas } = this;
    if (!canvas) {
      return;
    }
    const canvasContext = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext,
      viewport,
    };
    page.render(renderContext);
  }

  render() {
    const { className } = this.props;
    return <canvas ref={(canvas) => { this.canvas = canvas; }} className={className} />;
  }
}
