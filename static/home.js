function addButton() {
    let btn_div = document.getElementById('buttons');
    if (document.getElementById('button_1_label')) {
        if (document.getElementById('button_2_label')) {
            document.getElementById('2-btn-err').style.display = 'inherit';
        } else {
            btn_div.append(document.createElement('br'));
            let input = document.createElement('input');
            let input_2 = document.createElement('input');
            input.type = 'text';
            input.name = 'button_2_label';
            input.id = 'button_2_label';
            input.className = 'input-feild';
            input.placeholder = 'Button Label';
            input.value = b2l;
            input_2.type = 'text';
            input_2.name = 'button_2_url';
            input_2.id = 'button_2_url';
            input_2.className = 'input-feild';
            input_2.placeholder = 'Button Url';
            input_2.value = b2u;
            btn_div.append(input);
            btn_div.append(input_2);
        }
    } else {
        let input = document.createElement('input');
        let input_2 = document.createElement('input');
        input.type = 'text';
        input.name = 'button_1_label';
        input.id = 'button_1_label';
        input.className = 'input-feild';
        input.placeholder = 'Button Label';
        input.value = b1l;
        input_2.type = 'text';
        input_2.name = 'button_1_url';
        input_2.id = 'button_1_url';
        input_2.className = 'input-feild';
        input_2.placeholder = 'Button Url';
        input_2.value = b1u;
        btn_div.append(input);
        btn_div.append(input_2);
    }
}