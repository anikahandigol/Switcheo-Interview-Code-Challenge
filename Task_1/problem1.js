var sum_to_n_a = function(n) {

    //using for loop
    var sum = 0;
    if (n === 0) {
        return n;
    }else{
        for (let i = 1; i<=n; i++) {
            sum += i;
        }
    }
    return sum;
};

console.log(sum_to_n_a(4)) // 1+2+3+4 = 10

var sum_to_n_b = function(n) {
    //recursive solution
    if (n <= 1) {
        return n;
    }else{
        return n + sum_to_n_b(n-1);
    }
};  

console.log(sum_to_n_b(4)) // 10

var sum_to_n_c = function(n) {
    //using arithmetic series formula
    return (n*(n+1))/2;
};

console.log(sum_to_n_c(4)) // 10