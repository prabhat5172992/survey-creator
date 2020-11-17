import * as ko from "knockout";
import "./modal.scss";

const template = require("./modal.html");

export class ModalViewModel {
  private container: HTMLElement;
  public top = ko.observable();
  public left = ko.observable();
  public width = ko.observable();
  private showSubscription: ko.Computed<void>;
  constructor(
    public name: string,
    public data: any,
    public isVisible: ko.Observable<boolean>,
    public verticalPosition: "top" | "bottom" | "middle",
    public horizontalPosition: "left" | "right" | "center",
    rect: any
  ) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.innerHTML = template;
    ko.applyBindings(this, this.container);

    this.showSubscription = ko.computed(() => {
      if (this.isVisible()) {
        this.width(rect.width);
        if (horizontalPosition == "center") {
          this.left(rect.left);
        } else if (horizontalPosition == "left") {
          this.left(rect.left - rect.width);
        } else {
          this.left(rect.left + rect.width);
        }

        var height = (<HTMLElement>this.container.children[0]).offsetHeight;
        if (verticalPosition == "bottom") {
          this.top(rect.bottom);
        } else if (verticalPosition == "middle") {
          this.top((rect.bottom + rect.top) / 2 - height / 2);
        } else {
          this.top(rect.top - height);
        }
      }
    });
  }
  public dispose() {
    this.showSubscription.dispose();
    ko.cleanNode(this.container);
    this.container.remove();
  }
}

ko.components.register("svc-modal", {
  viewModel: {
    createViewModel: (params: any, componentInfo) => {
      var rect = componentInfo.element.getBoundingClientRect();
      const viewModel = new ModalViewModel(
        params.name,
        params.data,
        params.isVisible,
        params.verticalPosition,
        params.horizontalPosition,
        rect
      );
      return viewModel;
    },
  },
  template: "<div></div>",
});