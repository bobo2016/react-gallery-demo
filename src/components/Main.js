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

/*
 *get range random number
 */

function getRangeRandom(low, high){
    return Math.ceil( Math.random * (high - low) + low);
}

class ImgFigure extends React.Component{
	render(){

        let styleObj = {};

        //if props specify the image position, then use
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }

		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}
}


//AppComponent manage all the data and state | manager pattern
class AppComponent extends React.Component {
    //rearrange
    /*
     * rearrange all the images
     * @param centerIndex specify which image should be center positioned
     */

    rearrange: function(centerIndex){
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = AppComponent.constant,
            centerPos = AppComponent.Constant.centerPos,
            hPosRange = AppComponent.Constant.hPosRange,
            vPosRange = AppComponent.Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x，

            imgsArrangeTopArr = [],
            topImgNum = Math.ceil(Math.random() * 2), //get one or none
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

            //first center centerIndex image
            imgsArrangeCenterArr[0].pos = centerPos;

            //fetch top section image state info
            topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);


            //arrange top section image
            imgsArrangeTopArr.forEach((value,index) =>{
                imgsArrangeTopArr[index].pos = {
                    top: getRangeRandom (vPosRangeTopY[0],vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                };
            });

            //arrange left and right side image
            for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
                let hPosRangeLORX = null;

                //half front position left, half right position right 
                if(i < k){
                    hPosRangeLORX =  hPosRangeLeftSecX;

                }else{
                    hPosRangeLORX = hPosRangeRightSecX;
                }

                imgsArrangeArr[i].pos = {
                    top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                };
            }

            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
    },

    getInitialState: function(){
        return {
            imgsArrangeArr: [
                /*{
                    pos: {
                        left: '0',
                        top: '0'
                    }
                }*/
            ]
        };
    },

    // calculate each image position after the component mount
    componentDidMount: function(){
        //get stage size
        let stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,//object actual content width
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //get one image figure size
        let imgFigureDOM = this.refs.imgFigure0,
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);


        //calculate center image position
        AppComponent.constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        //calculate left and right image section position range
        AppComponent.constant.hPosRange.leftSecX[0] = -halfImgW;
        AppComponent.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        AppComponent.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        AppComponent.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        AppComponent.constant.hPosRange.y[0] = -halfImgH;
        AppComponent.constant.hPosRange.y[1] = stageH - halfImgH;


        //calculate top image section position range
        AppComponent.constant.vPosRange.topY[0] = -halfImgH
        AppComponent.constant.vPosRange.topY[1] = halfstageH - halfImgH * 3;
        AppComponent.constant.vPosRange.x[0] = halfStageW - imgW;
        AppComponent.constant.vPosRange.x[1] = halfStageW;

        //this.rearrange(0);

    }

    render() {

    	let controllerUnits = [],
    		ImgFigures = [];

    		imageDatas.forEach((value, index) => {

                if(!this.state.imgsArrangeArr[index]){
                    this.state.imgsArrangeArr[index] = {
                        pos: {
                            left: 0.
                            top: 0
                        }
                    };
                }

    			ImgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
    		})


        return (
        	<section className="stage" ref="stage">
        		<section className="img-sec">
        			{ImgFigures}
        		</section>
        		<nav className="controller-nav">
        			{controllerUnits}
        		</nav>
        	</section>
        );

    }
}

AppComponent.constant = {
    centerPos:{
        left: 0,
        right: 0
    },
    hPosRange: { //horizontal range
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y:[0, 0]
    },
    vPosRange: { //vertical range
        x: [0, 0],
        topY: [0, 0]
    }
};

export default AppComponent;
