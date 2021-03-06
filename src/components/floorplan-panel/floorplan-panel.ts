import { HomeAssistant } from '../../lib/homeassistant/types';
import { FloorplanPanelInfo } from './types';
import { css, CSSResult, html, LitElement, property, TemplateResult, PropertyValues } from "lit-element";
import '../floorplan/floorplan-element';

export class FloorplanPanel extends LitElement {
  @property({ type: Object }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow!: boolean;
  @property({ type: Object}) public panel!: FloorplanPanelInfo;

  @property({ type: Boolean }) public showSideBar!: boolean;
  @property({ type: Boolean }) public showAppHeader!: boolean;

  @property({ type: String }) public examplespath!: string;
  @property({ type: Boolean }) public isDemo!: boolean;
  @property({ type: Function }) public notify!: (message: string) => void;

  protected render(): TemplateResult {
    return html`
      <ha-app-layout>

        <app-header fixed slot="header" ?hidden=${!this.showAppHeader}>
          <app-toolbar>
            <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}"></ha-menu-button>
            <div main-title>${this.panel?.title}</div>
          </app-toolbar>
        </app-header>        

        <div class="content ${this.showAppHeader ? 'regular-height' : 'full-height'}">
          <floorplan-element .examplespath=${this.examplespath} .hass=${this.hass} ._config=${this.panel?.config?.config} .isDemo=${this.isDemo} .notify=${this.notify}></floorplan-element>
        </div>

      </ha-app-layout>
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host .content, :host .content floorplan-element {
        display: flex;
        flex-flow: column;
        flex: 1;
        min-height: 0;
      }

      :host .content.regular-height {
        height: calc(100vh - var(--header-height) - 10px);
      }

      :host .content.full-height {
        height: calc(100vh - 10px);
      }

      [hidden] {
        display: none !important;
      }
    `;
  }

  update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has('panel')) {
      this.showSideBar = (this.panel?.config.show_side_bar !== false);
      this.showAppHeader = (this.panel?.config.show_app_header !== false) && !this.isDemo;

      if (this.panel.config.show_side_bar === false) {
        this.hass.dockedSidebar = "always_hidden";
      }
    }
  }
}

if (!customElements.get('floorplan-panel')) {
  customElements.define('floorplan-panel', FloorplanPanel);
}
