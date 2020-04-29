import React, { Component } from 'react';
import { sp } from "@pnp/sp";
import moment from 'moment';
import ArchAnglePreviewItem from './ArchAnglePreviewItem';

class ArchitectsAnglePreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemDate: props.activeMonth,
      previewItems: [],
    }
  }

  componentDidMount = () => {
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: process.env.REACT_APP_SP_BASEURL
      },
    });

    this.getCurrentItems();
  }

  getCurrentItems = () => {
    let pictureCardComps = [];
    sp.web.lists.getByTitle("OMA_Architects_Angle_Archive").items.get()
    .then(items => {
      const sorted = items.sort((a, b) => a.GivenID - b.GivenID)
      sorted.forEach(el => {
        if (moment(el.Date).format("MMMM YYYY") === this.state.itemDate) {
          pictureCardComps.push(
            <ArchAnglePreviewItem
              key={el.GivenID}
              id={el.GivenID}
              title={el.Title}
              itemType={el.ItemType}
              img={el.Image.Url}
            />
          )
        }
      })
      if (pictureCardComps.length === 0) {
        items.forEach(el => {
          if (moment(el.Date).format("MMMM YYYY") === moment(this.state.itemDate).subtract(1, 'month').format('MMMM YYYY')) {
            pictureCardComps.push(
              <ArchAnglePreviewItem
                key={el.GivenID}
                id={el.GivenID}
                title={el.Title}
                itemType={el.ItemType}
                img={el.Image.Url}
              />
            )
          }
        })
        this.setState({ previewItems: pictureCardComps });
      }
      else {
        this.setState({ previewItems: pictureCardComps });
      }
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <ul className="em-c-picture-card-list em-l-grid em-l-grid--1-to-3up em-l-grid--break-slow">
            {this.state.previewItems}
          </ul>
        </div>
      </div>
    );
  }
}

export default ArchitectsAnglePreview;