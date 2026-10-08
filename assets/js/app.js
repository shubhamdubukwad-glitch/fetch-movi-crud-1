const cl = console.log;

const movieAddBtn = document.getElementById('movieAddBtn')
const movieContainer = document.getElementById('movieContainer')
const editMovieBtn = document.getElementById('editMovieBtn')
const deleteMovieBtn = document.getElementById('deleteMovieBtn')
//movi-form ids selects//
const moviModal = document.getElementById('moviModal')
const moviForm = document.getElementById('moviForm')
const movieName = document.getElementById('movieName')
const movieImg = document.getElementById('movieImg')
const movieDescription = document.getElementById('movieDescription')
const movieRating = document.getElementById('movieRating')
//moviform-footer ids selects//
const AddMovieCard = document.getElementById('AddMovieCard')
const UpdateMovieCard = document.getElementById('UpdateMovieCard')
const closeForm = [...document.querySelectorAll('.closeForm')]
const backDrop = document.getElementById('backDrop')
const spinner = document.getElementById('spinner')

//backend link add//
const BASE_URL = `https://shubham-92216-default-rtdb.asia-southeast1.firebasedatabase.app`;
const MOVIE_URL = `${BASE_URL}/movie.json`;

//state array//
const state = {
    movieArr: [],
    EDIT_ID: null,
}
//spinner show on Ui//
function showspinner() {
    spinner.classList.remove('d-none')
}
function hidespinner() {
    spinner.classList.add('d-none')
}
function toggelspiner() {
    spinner.classList.toggle('d-none')
}


//rating management//
function setRating(rating) {
    if (rating > 5 && rating <= 10) {
        return "badge badge-success"
    } else if (rating >= 3 && rating <= 5) {
        return "badge badge-warning"
    } else {
        return "badge-danger"
    }

}

// --------------------------------------------------------------READ-MOVI----------------------------------------------------------------
function readMovie(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += ` <div class="col-md-3 mt-5" id="${ele.id}">
                <div class="card movicard h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4 class="movieTitle movititle">${ele.movieName}</h4>
                        <h5><span class="badge ${setRating(ele.movieRating)}">${ele.movieRating}</span></h5>
                    </div>
                    <div class="card-body py-0">
                        <figure class="moviefigure">
                            <img src="${ele.movieImg}" alt="${ele.movieName}">

                            <figcaption class="m-0">
                                <h3>${ele.movieName}</h3>
                                <p>${ele.movieDescription} </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button id="editMovieBtn" onclick="EditMovie(this)" class="btn btn-sm net-sec-btn">EDIT</button>
                        <button id="deleteMovieBtn" onclick="removeMovie(this)" class="btn btn-sm net-pri-btn">REMOVE</button>
                    </div>
                </div>
            </div>`;
    });
    movieContainer.innerHTML = result;
}

function fetchMovie() {
    fetch(MOVIE_URL, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error..')
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key;
                state.movieArr.unshift(data[key]);
            }
            readMovie(state.movieArr)
        })
}
fetchMovie()
// --------------------------------------------------------------ADD-MOVI----------------------------------------------------------------
function onaddMovie(eve) {
    eve.preventDefault()
    let movieObj = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value
    }
    showspinner()
    fetch(MOVIE_URL, {
        method: "POST",
        body: JSON.stringify(movieObj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('somthing went wrong in create..?')
            }
            return res.json()
        })
        .then(data => {
            movieObj.id = data.name;
            state.movieArr.unshift(movieObj)
            let col = document.createElement('div')
            col.className = `col-md-3 mt-5`;
            col.id = movieObj.id;
            col.innerHTML = ` <div class="card movicard h-100"">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h3 class="movititle py-0">${movieObj.movieName}</h3>
                        <h5><span class="badge badge-success">${movieObj.movieRating}</span></h5>
                    </div>
                    <div class="card-body py-0">
                        <figure class="moviefigure">
                            <img src="${movieObj.movieImg}"alt="${movieObj.movieName}">

                            <figcaption class="m-0">
                                <h3>${movieObj.movieName}</h3>
                                <p>${movieObj.movieDescription} </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button id="editMovieBtn" onclick="EditMovie(this)" class="btn btn-sm net-sec-btn">EDIT</button>
                        <button id="deleteMovieBtn" onclick="removeMovie(this)" class="btn btn-sm net-pri-btn">REMOVE</button>
                    </div>
                </div>`;
            movieContainer.prepend(col)
            moviForm.reset()
            Swal.fire({
                title: "NEW MOVIE ADDED SUCCESSFULLY",
                text: "In netflix new movie added succeessfully..!!",
                icon: "success",
                timer: 3000
            });
            // moviForm.reset()

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
// --------------------------------------------------------------EDIT-MOVI----------------------------------------------------------------
function EditMovie(ele) {
    let edit_id = ele.closest('.col-md-3').id;
    showspinner()
    onmovieToggle()
    state.EDIT_ID = edit_id;

    let EDIT_URL = `${BASE_URL}/movie/${edit_id}.json`;
    fetch(EDIT_URL, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JET FROM LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Somthing went wrong..?')
            }
            return res.json()
        })
        .then(data => {
            movieName.value = data.movieName;
            movieImg.value = data.movieImg;
            movieDescription.value = data.movieDescription;
            movieRating.value = data.movieRating;

            AddMovieCard.classList.add('d-none');
            UpdateMovieCard.classList.remove('d-none')

            moviForm.classList.add('active')
            backDrop.classList.add('active')
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
// --------------------------------------------------------------UPDATE-MOVI----------------------------------------------------------------
function onupdateMovie() {
    let update_id = state.EDIT_ID
    let update_url = `${BASE_URL}/movie/${update_id}.json`;
    let updateobj = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value
    }
    showspinner()
    fetch(update_url, {
        method: "PATCH",
        body: JSON.stringify(updateobj),
        headers: {
            "content-type": "application/json",
            "Authorization": "TOKEN JWT FROM LS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error..?')
            }
            return res.json()
        })
        .then(data => {
            let getIndex = state.movieArr.findIndex(p => p.id === update_id)
            state.movieArr[getIndex] = updateobj;

            let card = document.getElementById(update_id)
            card.innerHTML = `<div class="card movicard h-100"">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h3 class="movititle py-0">${updateobj.movieName}</h3>
                        <h5><span class="badge badge-success">${updateobj.movieRating}</span></h5>
                    </div>
                    <div class="card-body py-0">
                        <figure class="moviefigure">
                            <img src="${updateobj.movieImg}"alt="${updateobj.movieName}">

                            <figcaption class="m-0">
                                <h3>${updateobj.movieName}</h3>
                                <p>${updateobj.movieDescription} </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button id="editMovieBtn" onclick="EditMovie(this)" class="btn btn-sm net-sec-btn">EDIT</button>
                        <button id="deleteMovieBtn" onclick="removeMovie(this)" class="btn btn-sm net-pri-btn">REMOVE</button>
                    </div>
                </div>`;
            moviForm.reset()
            AddMovieCard.classList.remove('d-none');
            UpdateMovieCard.classList.add('d-none');
            Swal.fire({
                title: "Movie Card Updated successfully..!!",
                text: "In netflix  movie card succeessfully ${updateobj.update_id}..!!",
                icon: "success"
            });

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hidespinner()
        })
}
// --------------------------------------------------------------DELETE-MOVI----------------------------------------------------------------
function removeMovie(ele) {
    let delete_id = ele.closest('.col-md-3').id;
    showspinner()
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let delete_url = `${BASE_URL}/movie/${delete_id}.json`;
            fetch(delete_url, {
                method: "DELETE",
                body: null,
                headers: {
                    "content-type": "application/json",
                    "Authorrization": "TOKEN JWT FROM LS"
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('errorr...?')
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = state.movieArr.findIndex(p => p.id === delete_id)
                    state.movieArr.splice(getIndex, 1);
                    ele.closest('.col-md-3').remove()
                    Swal.fire({
                        title: "Movie Deleted Successfully..!",
                        text: "In netflix movie removed succeessfully..!!",
                        icon: "success",
                        timer: 3000
                    });
                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                   hidespinner()
                })
        }
    });
}



function onmovieToggle() {
    backDrop.classList.toggle('active')
    moviModal.classList.toggle('active')
}

movieAddBtn.addEventListener("click", onmovieToggle)

closeForm.forEach(ele => {
    ele.addEventListener('click', onmovieToggle)
})


moviForm.addEventListener('submit', onaddMovie);
UpdateMovieCard.addEventListener('click', onupdateMovie)