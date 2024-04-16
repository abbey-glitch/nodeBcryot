
let btn_create = document.querySelector(".create>h3")
let product_tray = document.querySelector(".create>h3+ul")
btn_create.addEventListener("click", function(){
      product_tray.classList.add('show')
      btn_create.setAttribute('onclick', 'trayOff()')
//    product_tray.style.display = "block"   
})
// create a function to off
function trayOff(){
    product_tray.classList.remove('show')
    btn_create.removeAttribute("onclick")
}

// retrieve all product function
let static_dash = document.querySelector("#form")
let all_product = document.getElementById("allProducts")
all_product.addEventListener("click", function(){
    location.reload()
})
    $.ajax({
        url:"/all-products",
        type:"GET",
        success:function(data){
            let product_overlay = document.createElement("div")
            product_overlay.setAttribute("id", "trayProdt")
            const datas = data['products']
            datas.forEach(data => {
                // console.log(data);
                            product_overlay.innerHTML += `<div id="card">
                                            <figure id="pdtimg">
                                               <img src="/uploads/${data["img_name"]}" width="100%">
                                               <figcaption>$${data["pdtprice"]}</figcaption>
                                            </figure>
                                            <div id="pdt_name">
                                                <h3>${data["pdtname"]}</h3>
                                            </div>
                                            <div id="desc">
                                                <details>
                                                    <summary>Description</summary>
                                                    <p>${data["pdtdesc"]}</p>
                                                </details>
                                            </div>
                                            <div id="controls">
                                                <button>Published</button>
                                                <button onclick="deleteProd('${data['_id']}')">Delete</button>
                                                <button>Preview</button>
                                            </div>
                                        </div>`
                                        
            });
            // static_dash.innerHTML = "<h3>Hello</h3>"
            static_dash.appendChild(product_overlay)
        }
    })
    function deleteProd(id){
        $.ajax({
            type:"GET",
            url:"/product/delete",
            success:function(data){
               $viewpag = $("#form")
               $viewpag.append(data)
            //    $viewpag.animate({top:"0"})
                console.log($viewpag);
                // console.log(data);
            }
        })
    }
// console.log(uploadForm)

// create upload page
let pdtUp = document.getElementById("pdtUp")
pdtUp.addEventListener("click", function(){
    static_dash.innerHTML = `<form method="post" action="profile-upload-single" enctype="multipart/form-data">
                        <div id="picupload">
                            <input type="file" name="profile-file" required/>
                        </div>
                        <div id="pdtprice">
                            <input type="text" name="pdtname" required placeholder="enter a product name">
                        </div>
                        <select>
                            <option>Choose Product Category</option>
                            <option>Electronics</option>
                            <option>Fashions</option>
                            <option>Groceries</option>
                        </select>
                        <div id="price">
                            <input type="number" name="pdtprice" required placeholder="enter a product price">
                        </div>
                        <textarea cols="52" rows="20" name="pdtdesc" required autocomplete="on" placeholder="enter a product description">
                        </textarea>
                        <div id="controls">
                          <input type="submit" value="Upload" />
                          <input type="reset" value="reset"/>
                        </div>
                        </form>`
})
// end of product create form
// profile settings
let profileCont = document.querySelector("#profile")
let profSet = document.querySelector("#profile>img")
let proftray = document.createElement("div")
profSet.addEventListener("click", function(){
    proftray.setAttribute("id", "droprof")
    proftray.innerHTML = `<div>
                              <h3>SETTINGS</h3>
                              <hr/>
                              <button id="logout">LOG OUT</button>
                          </div>`
    profSet.setAttribute("onclick", "offprof()")
    profileCont.appendChild(proftray)
    // get the logout button and perform some logout functions
    let logut = document.getElementById("logout")
    logut.addEventListener("click", function(){
        alert("admin logout")
        $.ajax({
            type:"GET",
            url:"/admin/logout",
            success:function(data){
                console.log("admin log out successfully");
            }
        })
    })
    // console.log(logut);
    // alert("display")
})

console.log(profSet);
function offprof(){
    proftray.setAttribute("id", "dropoff")
    profSet.removeAttribute("onclick")
    // alert("off")
}