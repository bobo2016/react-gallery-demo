require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//Get image related data
let imageDatas = require('../data/imageDatas.json');

/*let yeomanImage = require('../images/yeoman.png');*/


// Get image Url from imageDatas.json filename
//Use self-invoke function for function only execute once
imageDatas = ((imageDatasArr) => {
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

let getRangeRandom = (low, high) => Math.ceil( Math.random() * (high - low) + low);

/*
 *Get 0-30 degree any abs value
 */

let get30DegRandom = () => ((Math.random() > 0.5 ? '' : '-' )  + Math.ceil(Math.random() * 30))
 

class ImgFigure extends React.Component{

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    /*
     * imgFigure handle click funciton
    */
    handleClick(e) {
        if(this.props.arrange.isCenter){
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

	render() {

        let styleObj = {};

        //if props specify the image position, then use
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }

        //if images rotate degree has value and not equal to 0, add rotate degree
        if(this.props.arrange.rotate){
            (['MozTransform','msTransform','WebkitTransform','transform']).forEach((value) =>{
                 styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            });         
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11; 
        }

        let imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';


		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
				</figcaption>
			</figure>
		)
	}
}



//control unit
class ControllerUnit extends React.Component{
    constructor(props){
        super(props);

        //if missed, would casue can not read props of null error
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {


        //if click button on state, then rotate image, otherwise center the image

        console.log(this.props.arrange.isCenter);
        if(this.props.arrange.isCenter){
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let controllerUnitClassName = 'controller-unit';

        //show button center state if center image
        if(this.props.arrange.isCenter){
            controllerUnitClassName += ' is-center';

            //show controller button if rotate image
            if(this.props.arrange.isInverse){
                controllerUnitClassName += ' is-inverse';
            }
        }

        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }

}


//AppComponent manage all the data and state | manager pattern
class AppComponent extends React.Component {
    

    constructor(props){
        super(props);
        this.Constant = {
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

        this.state = {
            imgsArrangeArr: [
               /* {
                    pos: {
                        left: '0',
                        top: '0'
                    },
                    rotate: 0, //image rotate degree
                    isInverse: false, // image inverse
                    isCenter: false
                }*/
            ]
        }
    }

    /*
     * @param index enter the current image info array index value which is called inverse function 
     * @return {Function} closure, return a pending called function 
     */

    inverse(index) {
        return () => { 
            let imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            //pass object function
            this.setState({
                imgsArrangeArr : imgsArrangeArr
            })
        }
    }

    /*
     * Use rearrange function, center index image
     * @param index, index for image info array 
     * @return {Function}
     */

    center(index) {
        return () => {
            this.rearrange(index);
        };
    }

    //rearrange
    /*
     * rearrange all the images
     * @param centerIndex specify which image should be center positioned
     */

    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //get one or none
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);


            //first center centerIndex image, center image no need rotate
            imgsArrangeCenterArr[0] = {
                pos : centerPos,
                rotate : 0,
                isCenter : true
            }


            //fetch top section image state info
            topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

            imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);


            


            //arrange top section image
            imgsArrangeTopArr.forEach((value,index) =>{
                imgsArrangeTopArr[index] = {
                    pos: {
                        top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                }
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

                imgsArrangeArr[i] = {
                    pos: {
                        top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                        left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                    },
                    rotate: get30DegRandom(),
                    isCenter: false
                }
            }

            if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
            }

            imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
    }

    // calculate each image position after the component mount
    componentDidMount() {
        //get stage size
        let stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,//object actual content width
            stageH = stageDOM.scrollHeight,

            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //get one image figure size
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);


        //calculate center image position
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };


        //calculate left and right image section position range
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;


        //calculate top image section position range
        this.Constant.vPosRange.topY[0] = -halfImgH
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;



        let num = Math.floor(Math.random() * 10);
        this.rearrange(num);

    }

    render() {

    	let ControllerUnits = [],
    		ImgFigures = [];

    		imageDatas.forEach((value, index) => {

                if(!this.state.imgsArrangeArr[index]){
                    this.state.imgsArrangeArr[index] = {
                        pos: {
                            left: 0,
                            top: 0
                        },
                        rotate: 0,
                        isInverse: false,
                        isCenter: false
                    };
                }

    			ImgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    		    ControllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
            })


        return (
        	<section className="stage" ref="stage">
        		<section className="img-sec">
        			{ImgFigures}
        		</section>
        		<nav className="controller-nav">
        			{ControllerUnits}
        		</nav>
        	</section>
        );
    }
}

AppComponent.propTypes = {};
AppComponent.defaultProps = {};

export default AppComponent;
