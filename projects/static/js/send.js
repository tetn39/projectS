function send() {
    var myArray = [1, 2, 3, 4, 5];
    console.log("実行")
    fetch('/js_py/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ myArray: myArray }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
