import React, {
    Component,
    PropTypes,
} from 'react';
import autoBind from 'react-autobind';

import Tile from './Tile';
import {items, RATE_LEVEL, classAnimate} from '../../config';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.instanceList = new Map();
        this.isClick      = false;

        this.state = {
            items: this.sort(items),
            classAnimate,
        }
    }

    sort = (items) => {
        return items.sort((a, b)=> parseInt(b.rating, 10) - parseInt(a.rating, 10));
    };

    onLeftClick(e, item) {
        if (this.isClick) return;
        this.isClick = true;
        this.updatePositionElements();
        let itemsAfterUpdateItem = this.getItemsAfterUpdateRating(item, +1);
        this.click(itemsAfterUpdateItem);
    }

    onRightClick(e, item) {
        if (this.isClick) return;
        this.isClick = true;
        this.updatePositionElements();
        let itemsAfterUpdateItem = this.getItemsAfterUpdateRating(item, -1);
        this.click(itemsAfterUpdateItem);
    }

    getItemsAfterUpdateRating(item, operation) {
        const updateInstance = (oldItem, newItem) => {
            let item = this.instanceList.get(oldItem);
            this.instanceList.delete(oldItem);
            this.instanceList.set(newItem, item);
        };

        const items = [...this.state.items];

        return items.map((value) => {
            if (value.id === item.id) {
                let {rating} = value;
                rating = rating + operation;
                if (rating < 0) {
                    rating = 0;
                } else if (rating > RATE_LEVEL) {
                    rating = RATE_LEVEL;
                }
                value = {
                    ...value,
                    rating,
                };
                updateInstance(item, value);
            }
            return value;
        });
    }

    click(items) {
        let newInstanceList = new Map();

        let itemsAfterSort = this.sort([...items]);
        items.forEach((item, i)=> {
            let newValue = itemsAfterSort[i];
            let itemInfo = this.instanceList.get(item); // информация по старому месту
            newInstanceList.set(newValue, itemInfo);
        });

        let prom = this.animateItems(items, newInstanceList);

        Promise.all(prom)
            .then(results => {
                debugger;
                this.setState({
                    ...this.state,
                    items: itemsAfterSort,
                }, ()=> {
                    this.setState({
                        ...this.state,
                        classAnimate: null,
                    }, ()=> {
                        let prom = [];
                        this.instanceList.forEach((item) => {
                            let instance             = item.instance;
                            instance.style.transform = `translateX(0px) translateY(0px)`;
                        });
                        setTimeout(()=> {
                            this.isClick = false;
                            this.setState({
                                ...this.state,
                                classAnimate: classAnimate,
                            });
                        }, 0);

                    })
                })
            })
            .catch(e => {
                console.error(e);
            });

    }

    onInstance(item, node) {
        let info = {
            instance: node,
            position: node.getBoundingClientRect(),
        };
        this.instanceList.set(item, info);
    }

    updatePositionElements() {
        let newInstanceList = new Map();
        this.instanceList.forEach((value, key)=> {
            let {instance, position} = value;
            position = instance.getBoundingClientRect(); //update position
            newInstanceList.set(key, {instance, position});
        });
        this.instanceList = newInstanceList;
    }

    animateItems(items, newInstanceList) {
        let instanceListAfter  = newInstanceList;
        let instanceListBefore = this.instanceList;

        let distances = items
            .map((item)=> {
                let oldPosition = instanceListBefore.get(item).position;
                let newPosition = instanceListAfter.get(item).position;
                let distance    = this.getDistance(newPosition, oldPosition);
                return {
                    item,
                    distance,
                }

            });

        return distances.map((item)=> {
            return new Promise((resolve, reject)=> {
                if (item.distance.dx || item.distance.dy) {
                    let instance = this.instanceList.get(item.item).instance;

                    let listener = function listener() {
                        this.removeEventListener("transitionend", listener);
                        resolve(true);
                    };
                    instance.addEventListener("transitionend", listener);

                    instance.style.transform = `translateX(${item.distance.dx}px) translateY(${item.distance.dy}px)`;

                } else {
                    resolve(true);
                }
            });
        });
    }

    getDistance = (up, down) => {
        return {
            dx: up.left - down.left,
            dy: up.top - down.top,
        }
    };

    render() {
        let {items, classAnimate} = this.state;
        return (
            <div>
                <h2>Галерея картинок с возможностью сортировки по рейтингу (React.js)</h2>
                <ul>
                    { items.map((item)=> {
                        return (
                            <Tile
                                key={item.id}
                                item={item}
                                classAnimate={classAnimate}
                                onLeftClick={this.onLeftClick}
                                onRightClick={this.onRightClick}
                                getInstance={this.onInstance}
                            />
                        )
                    }) }
                </ul>
            </div>
        );
    }
}

App.propTypes    = {};
App.defaultProps = {};

export default App;