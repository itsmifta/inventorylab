// PurchaseOrder model class to represent a purchase order
class PurchaseOrder {
  constructor(id, receivedDate, distributor, totalCost, products) {
    this.id = id;
    this.receivedDate = receivedDate;
    this.distributor = distributor;
    this.totalCost = totalCost;
    this.products = products || []; // Array of {productId, name, quantity, costPerUnit}
  }
}

export default PurchaseOrder;
