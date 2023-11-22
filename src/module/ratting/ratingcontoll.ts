import order from "../order/ordermodel";
import Product from "../product/productModel";
import rating from "./rattingmodel";
import Sequelize from "sequelize";
rating.belongsTo(Product, { foreignKey: "product_id" })



//... add rating ...

const addRating = async (req: any, res: any) => {
    const prodect: any = await Product.findOne({ where: { id: req.query.product_id } })
    const Findrate = await rating.findOne({ where: { user_id: req.payload.resp.id, product_id: req.query.product_id } })
    if (req.query.rating > 5) {
        res.status(200).json({ message: 'rating under 5' })
    }
    else {

        if (prodect && !Findrate) {
            await rating.create({
                user_id: req.payload.resp.id,
                product_id: req.query.product_id,
                rating: req.query.rating,
            })
            res.status(200).json({ message: 'rating is added' })
        }
        else if (prodect && Findrate) {
            await rating.update({ rating: req.query.rating }, { where: { user_id: req.payload.resp.id } })
            res.status(200).json({ message: 'rate updated' })
        }
        else {
            res.status(200).json({ message: 'product not by' })
        }
    }

}



// view rating .......

const viewrating = async (req: any, res: any) => {
    const grouprating = await rating.findAll({ attributes: ['product_id', 'rating'], group: ["product_id", "rating"] }).then((result: any) => {
        const group: any = []
        result.forEach((result: any) => {
            const productId = result.product_id
            const rating = result.rating

            if (!group[rating]) {
                group[rating] = [];
            }
            group[rating].push(productId)

        })

        for (const rating in group) {
            console.log(`rating ${rating}: ${group[rating].join(', ')}`);
        }
    })
    res.status(200).json({ grouprating })

}




const viewratingg = async (req: any, res: any) => 
{
        const groupRating = await rating.findAll({
            attributes: [
              'product_id',
              [Sequelize.literal('ROUND(AVG(rating))'), 'total_rating'],
            ],
            group: ['product_id'],
            include: [{ model: Product, attributes: ['ProductName'] }],
            order: [[Sequelize.literal('total_rating'), 'ASC']]
          });
          res.status(200).json(groupRating)
}




export default { addRating, viewrating, viewratingg }