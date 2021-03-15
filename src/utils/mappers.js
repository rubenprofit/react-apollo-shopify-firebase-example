import moment from 'moment';

export const orderDetailsMapper = (orders) => {
    let orderDetails = orders.edges.map(order => {
        return {
            number: order.node.name,
            price: `$${order.node.subtotalPrice}`,
            date: moment(order.node.processedAt).format('MM/DD/YYYY')
        }
    })
    return orderDetails;
};
