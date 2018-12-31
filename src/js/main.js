const MicroModal = window.MicroModal
const firebase = window.firebase
const storageRef = firebase.storage().ref();

(function () {
  const doc = document.documentElement

  doc.classList.remove('no-js')
  doc.classList.add('js')

  MicroModal.init()

  const fileInput = document.getElementsByName('myfile')
  document.getElementById('uploadButton').addEventListener('click', function () {
    fileInput[0].click()
  })

  // Upload file
  fileInput[0].addEventListener('change', handleFiles, false)

  // Reveal animations
  if (document.body.classList.contains('has-animations')) {
    /* global ScrollReveal */
    const sr = window.sr = ScrollReveal()

    sr.reveal('.hero-title, .hero-paragraph, .hero-cta', {
      duration: 1000,
      distance: '40px',
      easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
      origin: 'left',
      interval: 150
    })

    sr.reveal('.hero-illustration', {
      duration: 1000,
      distance: '40px',
      easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
      origin: 'right',
      interval: 150
    })

    sr.reveal('.feature', {
      duration: 1000,
      distance: '40px',
      easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
      interval: 100,
      origin: 'bottom',
      scale: 0.9,
      viewFactor: 0.5
    })

    const pricingTables = document.querySelectorAll('.pricing-table')

    pricingTables.forEach(pricingTable => {
      const pricingTableHeader = [].slice.call(pricingTable.querySelectorAll('.pricing-table-header'))
      const pricingTableList = [].slice.call(pricingTable.querySelectorAll('.pricing-table-features li'))
      const pricingTableCta = [].slice.call(pricingTable.querySelectorAll('.pricing-table-cta'))
      const elements = pricingTableHeader.concat(pricingTableList).concat(pricingTableCta)

      sr.reveal(elements, {
        duration: 600,
        distance: '20px',
        easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
        interval: 100,
        origin: 'bottom',
        viewFactor: 0.5
      })
    })
  }
}())

function handleFiles () {
  const fileList = this.files
  if (fileList.length > 0) {
    const file = fileList[0]
    uploadFile(file)
  }
}

function uploadFile (file) {
  MicroModal.show('modal-1')
  MicroModal.close('modal-1')
  MicroModal.show('modal-2')

  var fileName = guid() + '/' + file.name

  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child('files/' + fileName).put(file)

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      console.log('Upload is ' + progress + '% done')

      document.getElementById('uploadProgress').textContent = progress

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused')
          break
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running')
          break
      }
    }, function (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break

        case 'storage/canceled':
          // User canceled the upload
          break

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break
      }
    }, function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL)

        var shareSection = document.getElementById('shareSection')
        shareSection.setAttribute('style', '')
        shareSection.getElementsByTagName('input')[0].value = downloadURL
        shareSection.getElementsByTagName('a')[0].setAttribute('href', downloadURL)
      })
    })
}

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
