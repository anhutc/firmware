const IPSWDevicesMD5 = '053b52572a2f31f24e63ab60730c386a';
var devices;      // Devices JSON object
var jailbreaks;   // Jailbreaks JSON object
var productName;  // Selected product (iPhone, iPad, etc.)
var product;      // devices[productName]
var deviceName;   // Selected device name (iPhone 6s Plus, etc.)
var firmwareList; // jailbreaks[deviceName]
$.ajaxSettings.async = false;
$.getJSON('data/device.json', json => {
    devices = json;
});

const params = new URLSearchParams(window.location.search);

function jumpToFirmware(object) {
    let name = $(object).attr('data-device');
    let newParams = new URLSearchParams();
    newParams.set('product', productName);
    newParams.set('name', name);
    window.location.href = '?' + newParams.toString();
}

if (!params.has('product') && !params.has('name')) {
    $('#rowDeviceAlert').removeClass('d-none');
    $('#rowDevice').removeClass('d-none');
    $.ajax({
        url: 'https://api.ipsw.me/v4/devices?keysOnly=false',
        type: 'GET',
        async: true,
        success: json => {
            $('#deviceStatus').removeClass('alert-light');
            const newMD5 = md5(json);
            if (newMD5 !== IPSWDevicesMD5) {
                console.log(newMD5);
                $('#deviceStatus').addClass('alert-warning');
                $('#deviceStatus').html('此页面可能已过时，某些较新的设备未能显示在列表中。请联系网站管理员或者前往 GitHub 自行添加。');
            } else {
                $('#deviceStatus').addClass('alert-success');
                $('#deviceStatus').html('当前设备列表是最新的。');
                setTimeout(() => $('#deviceStatus').alert('close'), 3000);
            }
        },
        error: xhr => {
            $('#deviceStatus').addClass('alert-warning');
            $('#deviceStatus').html('更新设备列表时出现问题。');
        }
    })
    for (let product in devices) {
        let latestIdentifier = devices[product].slice(-1)[0].devices[0].identifier;
        $('#rowDevice').append(`
<div class="col-md-4 mb-3">
    <a class="card" href="?product=${product}">
        <div class="card-img-top product-img-container">
            <img src="https://ipsw.me/assets/devices/${latestIdentifier}.png" class=" product-img" alt="${product}">
        </div>
        <div class="card-body">
            <h5 class="card-title text-center">${product}</h5>
        </div>
    </a>
</div>`
        );
    };
}
if (params.has('product') && !params.has('name')) {
    $('#rowProduct').removeClass('d-none');
    $('#nav1').removeClass('active');
    $('#nav2').removeClass('disabled').addClass('active').attr('href', window.location.search);
    productName = params.get('product');
    $('#selectedProduct').removeClass('d-none').text('已选择：' + productName);
    product = devices[productName];
    let popoverHTML = {};
    for (let i = product.length - 1; i >= 0; i--) {
        const deviceID = 'id' in product[i] ? product[i].id : product[i].name;
        const size = 'size' in product[i] ? `<small class="pl-2 font-weight-light">${product[i].size} 英寸</small>` : '';
        const generation = 'generation' in product[i] ? `<small class="pl-2 font-weight-light"> 第 ${product[i].generation} 代</small>` : '';
        let variants = [];
        for (let j in product[i].devices) {
            let obj = product[i].devices[j];
            popoverHTML[obj.name] = `
            <span class="badge badge-pill badge-info">标识符 </span>
            <span class="pl-1 text-monospace">${obj.identifier}</span><br>
            <span class="badge badge-pill badge-info">型　号 </span>
            <span class="pl-1 text-monospace">${obj.boardconfig}</span>`;
            variants.push(`
            <span data-toggle="popover"
                  data-title="${obj.name}"
                  class="btn btn-sm btn-stroke-light disabled">${obj.name}</span>
            `);
        }
        $('#colProduct').append(`
<button class="btn btn-block btn-light border-secondary mb-3" onclick="jumpToFirmware(this)" data-device="${deviceID}">
    <div class="row no-gutters">
        <div class="col col-md-9 text-left">
            <div class="card-body">
                <h5 class="card-title">${product[i].name}${size + generation}</h5>
                <p class="card-text">
                    包括：<br>
                    ${variants.join(' ')}
                </p>
            </div>
        </div>
        <div class="d-none d-md-block col-md-3 small-device-img-container">
            <img class="small-device-img" src="https://ipsw.me/assets/devices/${product[i].devices[0].identifier}.png">
        </div>
    </div>
</button>`);
    }
    $('[data-toggle="popover"]').each(function () {
        $(this).popover({
            html: true,
            template: `<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>`,
            trigger: 'hover',
            placement: 'bottom',
            content: popoverHTML[$(this).text()]
        });
    });
}

if (params.has('name')) {
    $.getJSON('data/jailbreak.json', json => {
        jailbreaks = json;
    });
    $('#rowFirmware').removeClass('d-none');
    $('#nav1').removeClass('active');
    let temp = new URLSearchParams();
    temp.set('product', params.get('product'))
    $('#nav2').removeClass('disabled').attr('href', '?' + temp.toString());
    $('#nav3').removeClass('disabled').addClass('active').attr('href', window.location.search);
    deviceName = params.get('name');
    $('#selectedName').removeClass('d-none').text('已选择：' + deviceName);
    firmwareList = jailbreaks[deviceName];
    console.log(firmwareList);
    let colorClass = {
        'NONE': 'table-danger',
        'TETHERED': 'table-warning',
        'SEMI-TETHERED': 'table-primary',
        'SEMI-UNTETHERED': 'table-info',
        'UNTETHERED': 'table-success'
    };
    let typeText = {
        'NONE': '',
        'TETHERED': '不完美越狱',
        'SEMI-TETHERED': '半不完美越狱',
        'SEMI-UNTETHERED': '半完美越狱',
        'UNTETHERED': '完美越狱'
    };
    for (let i in firmwareList) {
        let obj = firmwareList[i];
        let comment = 'comment' in obj ? `<br><small>${obj.comment}</small>` : '';
        let td = 'tool' in obj ? `<td class="text-monospace">${obj.tool + comment}</td>` : '<td class="text-danger">暂无越狱</td>';
        $('#listFirmware').prepend(`
<tr class="${colorClass[obj.type]}">
    <th scope="row">${i}</th>
    ${td}
    <td>${typeText[obj.type]}</td>
</tr>`
        )
    }
}