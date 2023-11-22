import order from '../order/ordermodel'
import { Op } from 'sequelize'
import moment from 'moment'
import notification from '../notification/notificationModel'

//.......................... view in sorted order...............................

const sortview = async (req: any, res: any) => {

    const today = moment()


    let Where:any={}

    // ...if two value present..
    
        if (req.query.status) 
        {
            Where.status = req.query.status
        }
        if (req.query.endDate && req.query.startDate) 
        {
            Where.createdAt= { [Op.between]: [moment(req.query.endDate).startOf('days'), moment(req.query.startDate).endOf('days')] } 
        }
        else
        {
            Where.createdAt={ [Op.between]: [moment().startOf('day'),moment().endOf('day')] }
        }

       

        const view = await order.findAll({ where: Where, order: [['createdAt', 'DESC'],] })
        console.log(view)
        res.status(200).json({ view })

    }


// ...........view status of the order.......

const viewStatus = async (req: any, res: any) => {
    // if parameter in status....
    if (req.query.status) {
        const view = await order.findAll({
            where: { status: req.query.status },
            order: [
                ['updatedAt', 'DESC'],]
        })
        res.status(500).json({ view })
    }

    else {
        // no parameter are given

        const view = await order.findAll({
            where: { status: "pending" },
            order: [
                ['updatedAt', 'DESC'],]
        })
        res.status(500).json({ view })
    }
}


//............................. order approvel.........................

const verification = async (req: any, res: any) => {

    const View =await order.findOne({where:{id:req.query.id}})
    if(!View)
    {
        res.status(500).json({ message: "id not found !" })

}
else
{
       
    const view = await order.update({ status: "approved" },{ where: { status: "pending",id:req.query.id } })
    res.status(500).json({ message: "verified" })

    //.......notification....
    const update= await notification.update({message:"order is approved and wait for order"},{where:{order_id:req.query.id }})
    console.log ("notification",{update})

}
}

//...admin history......

const history= async (req:any,res:any)=>
{ 
    let Where:any={}
    if(req.query.status)
    {
        Where.status=req.query.status
    }
    if(req.query.today)
    {
        Where.createdAt={[Op.between]:[moment().startOf('day'),moment().endOf('day')]}
    }
    if(req.query.startDate||req.query.endDate)
    {
        Where.createdAt={[Op.between]:[moment(req.query.startDate).startOf('day'),moment(req.query.endDate).endOf('day')]}
    }
    const History=await order.findAll({where:Where,order:[['createdAt','DESC']]})
    res.status(200).json ({History})
}






export default { sortview, viewStatus, verification,history }