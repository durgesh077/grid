let PDFDocument=require("pdfkit")
let qr=require("qrcode")
let fs=require('fs')
//it is used for generating warranty card in pdf form 
async function genPDF(brand_name,model_name,serial_number,
						warranty_period,expiry_date,warranty_number,remarks,
						history){
	let warranty_QR_img=await qr.toBuffer(new String(warranty_number).toString())
	let fd=fs.createWriteStream('qr.pdf')
	let doc=new PDFDocument()
	doc.pipe(fd)
	let imageWidth = 180 // image width
	let image_pos_x=doc.page.width-imageWidth;
	let image_pos_y=0;
	doc.image(warranty_QR_img, image_pos_x
        ,image_pos_y,{
        width:imageWidth,
        height:imageWidth
      });
	let margin=3;
	doc.fontSize(8)
	doc.text(warranty_number,{align:'center',valign:'top'})
	doc.rect(margin, margin, doc.page.width-2*margin, doc.page.height-2*margin).strokeColor('green').lineWidth(7).stroke();
	doc.rect(image_pos_x+20,image_pos_y+20,imageWidth-2*20,imageWidth-2*20).strokeColor('black').lineWidth(3).stroke();
	doc.fontSize(15)

	doc.moveDown(1.5)
	doc.fillColor('black').text("Brand Name :",{continued:true}).fillColor('blue').
	text(" "+brand_name)	
	doc.moveDown(0.5)

	doc.fillColor('black').text("Model Name :",{continued:true}).fillColor('blue').
	text(" "+model_name)	
	doc.moveDown(0.5)

	doc.fillColor('black').text("Serial Number :",{continued:true}).fillColor('brown').
	text(" "+serial_number)
	doc.moveDown(0.5)

	let dayInSeconds=24*60*60*1000
	let purchase_date=new Date(new Date(expiry_date)- warranty_period *365*dayInSeconds)

	doc.fillColor('black').text("Purchase Date:",{continued:true}).fillColor('green').
	text(" "+purchase_date.toLocaleDateString(),{continued:true}).fillColor('darkgray').text("(mm/dd/yyyy)")
	doc.moveDown(0.5)

	doc.fillColor('black').text("Expiry Date:",{continued:true}).fillColor('tomato').
	text(" "+new Date(expiry_date).toLocaleDateString(),{continued:true}).fillColor('darkgray').text("(mm/dd/yyyy)")
	doc.moveDown(0.5)


	let remaining_days=Math.max(0,Math.floor((new Date(expiry_date)-new Date())/(dayInSeconds)))
	doc.fillColor('black').text("Remaining days:",{continued:true}).fillColor('red')
	.text(" "+remaining_days+" days",)
	doc.moveDown(0.5)

	doc.fillColor('black').text("Warranty Period (in years) :",{continued:true}).fillColor('darkcyan').
	text(" "+warranty_period)
	doc.moveDown(1.5)

	doc.fillColor("black").text("REMARKS:-",{align:'center',underline:true})
	doc.fillColor('#3f3f3f')
	doc.list(['hello','how are you'])

	doc.addPage()
	doc.fontSize(20).fillColor('orange').text("PURCHASE HISTORY",{underline:true,align:'center'})
	doc.moveDown(2)
	//a closure function to add new history data
	function addPage(doc,data){
		//function to fillup values of history
		function addTxt(doc,key,value,col){
			doc.moveDown(.4).fillColor(col)
			doc.fillColor('black').text(`${key}: `,{continued:true}).fillColor(col).text(value)
		}
		let curX=doc.x-25,curY=doc.y
		for(let [a,b] of data){
			addTxt(doc,a,b,'darkcyan')
			doc.lineWidth(2)
		}
		doc.rect(curX,curY,doc.page.width-2*curX,doc.y-curY).strokeColor('darkgreen').stroke()
	}

	for(let his of history){
		addPage(doc,his)
		doc.moveDown(1)
		}

	doc.end()
}
try{
genPDF("Samsung",'galaxy','1231412314421',"5","8/2/2022",55555,["love","nothign"],[[
	['date','12/4/20'],['from','durgesh']
	],[
	['date','12/4/20'],['from','durgesh']
	],[
	['from','flipkart'],['to',['99912342']],['to',['99912342']]
	]])
}catch{
	console.log("error")
}