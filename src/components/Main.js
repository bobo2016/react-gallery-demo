require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//Get image related data
let imageDatas = require('../data/imageDatas.json');

/*let yeomanImage = require('../images/yeoman.png');*/


// Get image Url from imageDatas.json filename
//Use self-invoke function for function only execute once
imageDatas = (function genImageURL(imageDatasArr) {
	for(var i = 0, j = imageDatasArr.length; i < j; i++){
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);


class ImgFigure extends React.Component {
  render() {

        return (
            <figure className="img-figure">
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                </figcaption>
            </figure>
        )
  }
}


//manager pattern
class AppComponent extends React.Component {
  render() {


        let controllerUnits = [],
            imgFigures = [];



        imageDatas.forEach(function(value){
            imgFigures.push(<ImgFigure data={value}/>);
        })



        return (
        	<section className="stage">
        		<section className="img-sec">
                   {imgFigures}
                </section>
        		<nav className="controller-nav">
                   {controllerUnits}
                </nav>
        	</section>
        );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
