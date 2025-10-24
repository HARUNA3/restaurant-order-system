// Server side, keep separate

export default function handler(req, res){
    if(req.method === "POST"){
        const order = req.body;
        console.log("New Order:", order);
        res.status(200).json({status: "OK"});

    }else {
        res.status(405).json({error: "Method not allowed"});
    }
}


