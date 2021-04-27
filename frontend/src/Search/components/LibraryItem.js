import React, { useState } from 'react';
import Card from '../../shared/Card';
import './LibraryItem.css';
import Modal from '../../shared/Modal';
import Map from '../../shared/Map';
import Button from '../../shared/Button';

const LibraryItem = props => {
    const [showMap, setShowMap] = useState(false);

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);
    return (
        <React.Fragment>
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.location} zoom={16} />
                </div>
            </Modal>
            <li className='lib_item'>
                <Card>
                    <div>
                        <div className='align-left'>                        <strong>{props.name}</strong>
                            <br />
                            <sub> Address : {props.address}, {props.city}, {props.country}</sub>
                            <br />
                            <sub> Distance: {props.distance}</sub>
                            <br />
                            {props.time && (<sub> Driving Time : {props.time} </sub>)}
                        </div>

                        <div className='align-right'>
                            <Button inverse onClick={openMapHandler}>
                                VIEW ON MAP
                            </Button>
                            <Button to={`/${props.id}/books`}> Sell All Books</Button>
                        </div>
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default LibraryItem
