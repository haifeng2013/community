import React, { Component } from 'react'
import {requests, offers} from '../configs.json'
import {access_token, app_id, app_code} from '../credentials.json'

class Map extends Component {
    state = {}

    display = null

  componentDidMount() {
    const here = window.here;

    var imageLayer = new here.xyz.maps.layers.TileLayer({
        name: 'Image Layer',
        min: 1,
        max: 20,
        provider: new here.xyz.maps.providers.ImageProvider({
            name: 'Live Map',
            url : 'https://{SUBDOMAIN_INT_1_4}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{LEVEL}/{COL}/{ROW}/256/png8?app_id='+app_id+'&app_code='+app_code
        })
    });

    this.display = new  here.xyz.maps.Map( document.getElementById("map"), {
        zoomLevel : 17,
        center: {
            longitude: 11.323544, latitude: 50.979492
        },

        // add layer to display
        layers: [imageLayer]
    });


    window.onresize = ()=>{
        let container = this.display.getContainer();
        this.display.resize(container.offsetWidth, container.offsetHeight);
    }

    this.props.setMap(this.display, this.addCommunityLayer);
  }

  addCommunityLayer = () => {
    let display = this.display;
    let props = this.props;

    var RequestsLayer = new window.here.xyz.maps.layers.TileLayer({
        name: 'my Community Requests',
        min: 4,
        max: 18,
        provider: new window.here.xyz.maps.providers.SpaceProvider ({
            name: 'SpaceProvider',
            level: 13,
            space: requests,
            credentials: {
                access_token: access_token
            }
        }),
        style:{
            styleGroups: {
                style: [
                    {zIndex:0, type:"Circle", "stroke": "#FFFFFF", "fill": "#00006B", opacity: 0.8, radius: 15},
                    {zIndex:1, type:"Text", fill:"#FFFFFF", text:"R", font:"normal 12px Arial"}
                ]
            },
            assign: function(feature){
                return "style";
            }
        }
    });

    var OffersLayer = new window.here.xyz.maps.layers.TileLayer({
        name: 'my Community Offers',
        min: 4,
        max: 18,
        provider: new window.here.xyz.maps.providers.SpaceProvider ({
            name: 'SpaceProvider',
            level: 13,
            space: offers,
            credentials: {
                access_token: access_token
            }
        }),
        style:{
            styleGroups: {
                style: [
                    {zIndex:0, type:"Circle", "stroke": "#FFFFFF", "fill": "#006B00", opacity: 0.8,radius: 15},
                    {zIndex:1, type:"Text", fill:"#FFFFFF", text:"O", font:"normal 12px Arial"}
                ]
            },
            assign: function(feature){
                return "style";
            }
        }
    });

    var localLayer = new window.here.xyz.maps.layers.TileLayer({
        name: 'Local Layer',
        min: 14,
        max: 20,
        provider: new window.here.xyz.maps.providers.LocalProvider ({
            name:  'myProvider'
        })
    });

    display.addLayer(RequestsLayer);
    display.addLayer(OffersLayer);
    display.addLayer(localLayer);

    display.addEventListener('pointerup', (e)=>{
        if(e.target) {
            console.log(e.target.properties, 'mmmmm')
            props.showContact(e.target.properties);
            props.setSelected(e.target.properties);
        } else {
            props.hideContact();
        }
    })
    let feature;
    display.addEventListener('pointerenter', function(e){
        if(e.target && e.target.properties.identity == 'offers') {
            let l = display.getLayers(2);
            let pos = e.target.properties.coordinate;
            let r = e.target.properties.radius;
            console.log(pos, r)

            let toplat = r * 180 / (6.371 * 1e6 * Math.PI) + pos.latitude ;
            let toplon = pos.longitude;

            let posPixel = display.geoToPixel(pos);
            let topPixel = display.geoToPixel({latitude: toplat, longitude: toplon});

            r = posPixel.y - topPixel.y;

            l.setStyleGroup(e.target, [
                {zIndex:0, type:"Circle", "stroke": "#FFFFFF", "fill": "#006B00", opacity: 0.3,radius: r},
                {zIndex:0, type:"Circle", "stroke": "#FFFFFF", "fill": "#006B00", opacity: 0.8,radius: 15}
            ]);
        }
    })
    display.addEventListener('pointerleave', function(e){
        if(e.target && e.target.properties.identity == 'offers') {
            let l = display.getLayers(2);

            l.setStyleGroup(e.target);
        }
    })
  }

  render() {
    return (
      <div id="map"></div>
    );
  }
}

export default Map