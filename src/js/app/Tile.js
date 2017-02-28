import React, {
    Component,
    PropTypes,

} from 'react';
import ReactDOM from 'react-dom';

class Tile extends Component {
    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        this.update();
        debugger;
    }

    update(){
        let {getInstance, item} = this.props;
        let node = ReactDOM.findDOMNode(this);
        getInstance(item, node);
    }

    render() {
        let {onLeftClick, onRightClick, item, classAnimate} = this.props;
        const rating = Array.from({length: item.rating})
            .map(item => '★')
            .join('');
        let image = require("../../img/"+item.image);
        return (

            <li className={classAnimate}
                onClick={e => {e.preventDefault(); onLeftClick(e, item)}}
                onContextMenu={e => {e.preventDefault(); onRightClick(e, item)}}
            >
                <span className="star">{rating}</span>
                <a href="#">
                    <img src={image}/>
                </a>
            </li>
        );
    }
}

Tile.propTypes = {
    getInstance: PropTypes.func.isRequired,
    onLeftClick: PropTypes.func.isRequired,
    onRightClick: PropTypes.func.isRequired,
    classAnimate: PropTypes.string,
    item: PropTypes.object,

};
Tile.defaultProps = {};

export default Tile;

