export function createShippingLabel(shipment: any): HTMLElement {
  const container = document.createElement('div');
  container.className = 'shipping-label';
  container.style.cssText = `
    width: 148mm;
    padding: 20px;
    background: white;
    font-family: Inter, system-ui, -apple-system, sans-serif;
  `;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <img 
        src="https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png" 
        style="height: 40px; object-fit: contain;"
      />
      <div style="text-align: right;">
        <div style="font-size: 14px; font-weight: bold;">SOUTOURA FANA</div>
        <div style="font-size: 12px; color: #666;">Air & Maritime Transport</div>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: bold; color: #4F46E5; margin-bottom: 5px;">
        Tracking Information
      </div>
      <div style="font-size: 14px; margin-bottom: 5px;">
        <span style="color: #666;">Tracking No:</span> ${shipment.trackingNumber}
      </div>
      <div style="font-size: 14px; margin-bottom: 5px;">
        <span style="color: #666;">Mode:</span> ${shipment.mode.toUpperCase()}
      </div>
      <div style="font-size: 14px;">
        <span style="color: #666;">Route:</span> ${shipment.origin} → ${shipment.destination}
      </div>
    </div>

    ${shipment.qrCode ? `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${shipment.qrCode}" style="width: 120px; height: 120px;" />
      </div>
    ` : ''}

    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: bold; color: #4F46E5; margin-bottom: 5px;">
        Recipient
      </div>
      <div style="font-size: 14px; margin-bottom: 5px;">
        ${shipment.recipient.name}
      </div>
      <div style="font-size: 14px;">
        ${shipment.recipient.phone}
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: bold; color: #4F46E5; margin-bottom: 5px;">
        Package Details
      </div>
      <div style="font-size: 14px; margin-bottom: 5px;">
        ${shipment.packaging}
      </div>
      ${shipment.weights ? `
        <div style="font-size: 14px;">
          Total Weight: ${Object.values(shipment.weights).reduce((a: any, b: any) => (a || 0) + (b || 0), 0)} kg
        </div>
      ` : ''}
    </div>

    <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #666;">
      For any inquiries about your shipment, please contact our customer service
    </div>
  `;

  return container;
}

export function createInvoice(shipment: any): HTMLElement {
  const container = document.createElement('div');
  container.className = 'invoice';
  container.style.cssText = `
    width: 210mm;
    padding: 20px;
    background: white;
    font-family: Inter, system-ui, -apple-system, sans-serif;
  `;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
      <div>
        <img 
          src="https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png" 
          style="height: 40px; object-fit: contain; margin-bottom: 10px;"
        />
        <div style="font-size: 16px; font-weight: bold;">SOUTOURA FANA</div>
        <div style="font-size: 12px; color: #666;">Air & Maritime Transport</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">INVOICE</div>
        <div style="font-size: 10px; color: #666;">Date: ${new Date(shipment.createdAt).toLocaleDateString()}</div>
        <div style="font-size: 10px; color: #666;">Invoice #: INV-${shipment.trackingNumber}</div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
      <div style="flex: 1;">
        <div style="font-size: 12px; font-weight: bold; color: #4F46E5; margin-bottom: 5px;">From</div>
        <div style="font-size: 14px; margin-bottom: 5px;">${shipment.sender.name}</div>
        <div style="font-size: 14px; margin-bottom: 5px;">${shipment.sender.phone}</div>
        <div style="font-size: 14px;">${shipment.origin}</div>
      </div>
      <div style="flex: 1;">
        <div style="font-size: 12px; font-weight: bold; color: #4F46E5; margin-bottom: 5px;">To</div>
        <div style="font-size: 14px; margin-bottom: 5px;">${shipment.recipient.name}</div>
        <div style="font-size: 14px; margin-bottom: 5px;">${shipment.recipient.phone}</div>
        <div style="font-size: 14px;">${shipment.destination}</div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <thead>
        <tr style="background: #F3F4F6;">
          <th style="text-align: left; padding: 10px; border-bottom: 1px solid #E5E7EB;">Description</th>
          <th style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">Weight</th>
          <th style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">Rate</th>
          <th style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${shipment.weights?.food ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Food Items</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">${shipment.weights.food} kg</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">€3.00/kg</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">€${(shipment.weights.food * 3).toFixed(2)}</td>
          </tr>
        ` : ''}
        ${shipment.weights?.nonFood ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">Non-Food Items</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">${shipment.weights.nonFood} kg</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">€4.90/kg</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">€${(shipment.weights.nonFood * 4.9).toFixed(2)}</td>
          </tr>
        ` : ''}
        ${shipment.weights?.hn7 ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">HN7 Items</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">${shipment.weights.hn7} kg</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">€7.00/kg</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #E5E7EB;">€${(shipment.weights.hn7 * 7).toFixed(2)}</td>
          </tr>
        ` : ''}
      </tbody>
    </table>

    ${shipment.payment ? `
      <div style="margin-left: auto; width: 300px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div style="font-weight: bold;">Subtotal (EUR):</div>
          <div>€${shipment.payment.baseAmount.toFixed(2)}</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div style="font-weight: bold;">Subtotal (XOF):</div>
          <div>${Math.round(shipment.payment.baseAmountXOF).toLocaleString()} XOF</div>
        </div>
        ${shipment.payment.advanceAmount ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-weight: bold;">Advance Payment:</div>
            <div>€${shipment.payment.advanceAmount.toFixed(2)}</div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #DC2626;">
            <div style="font-weight: bold;">Balance Due (EUR):</div>
            <div>€${shipment.payment.remainingAmount.toFixed(2)}</div>
          </div>
          <div style="display: flex; justify-content: space-between; color: #DC2626;">
            <div style="font-weight: bold;">Balance Due (XOF):</div>
            <div>${Math.round(shipment.payment.remainingAmountXOF).toLocaleString()} XOF</div>
          </div>
        ` : ''}
      </div>
    ` : ''}

    <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666;">
      Thank you for choosing SOUTOURA FANA Transport. For any questions about this invoice, please contact our customer service.
    </div>
  `;

  return container;
}