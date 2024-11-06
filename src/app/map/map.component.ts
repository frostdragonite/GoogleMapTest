import { Component, Renderer2 } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapPolygon } from '@angular/google-maps';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker, MapPolygon, NgIf],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  center: google.maps.LatLngLiteral = { lat: 13.721023240651109, lng: 100.52688656378919}
  options: google.maps.MapOptions = {
    gestureHandling: 'cooperative',
  }

  // Marker is deprecated, use AdvancedMarker
  MarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = {gmpDraggable: false};
  MarkerPositions: google.maps.LatLngLiteral[] = [];
  clickMarkerPosition: google.maps.LatLngLiteral = this.center;
  clickMarkerContent: Node | null = null;
  clickMarkerTimer: any
  polygonVertices: google.maps.LatLngLiteral[] = [];
  showPolygon = true;

  // Click Marker Content
  constructor(private renderer: Renderer2) { this.createMarkerContent(); }
  createMarkerContent() {
    const container = this.renderer.createElement('div');
    this.renderer.setStyle(container, 'width', '30px');
    this.renderer.setStyle(container, 'height', '40px');
    this.renderer.setStyle(container, 'display', 'flex');
    this.renderer.setStyle(container, 'justify-content', 'center');
    this.renderer.setStyle(container, 'align-items', 'center');

    const svg = `
      <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36C12 36 24 21.864 24 12C24 5.372 18.627 0 12 0C5.372 0 0 5.372 0 12C0 21.864 12 36 12 36Z" fill="#003f66"/>
        <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
      </svg>
    `;
    container.innerHTML = svg;
    this.clickMarkerContent = container;
  }

  display: google.maps.LatLngLiteral = this.center;
  isRecentlyClicked: boolean = false;
  
  moveMap(map: GoogleMap) {
    const center = map.getCenter();
    if (center) { 
      this.display = center?.toJSON()
    }
  }

  getClickPosition(event: google.maps.MapMouseEvent) {
    if (event.latLng) { 
      this.isRecentlyClicked = true;
      this.clickMarkerPosition = event.latLng.toJSON()
      
      if (this.clickMarkerTimer) {
        clearTimeout(this.clickMarkerTimer);
      }

      this.clickMarkerTimer = setTimeout(() => {
        this.isRecentlyClicked = false;
      }, 2000);
    }
  }

  addMarker() {
    this.MarkerPositions.push(this.clickMarkerPosition);
    console.log(this.MarkerPositions)
  }
  

  setPolygon() {
    this.showPolygon = false;
    setTimeout(() => {
      this.polygonVertices = [...this.MarkerPositions];
      this.showPolygon = true;
    });
  }
}
