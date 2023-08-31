const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('.playlist');
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio  = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const PLAYER_STORAGE_KEY = 'PLAYER_MUSIC';
const app = {
    currentIndex: 0,
    isPlaying: false,
    isSeeking: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name: '10 ngàn năm',
            singer: 'PC',
            path: 'assets/music/10NganNam.mp3',
            image:'assets/img/10nganNam.jpg'
        },
        {
            name: 'Anh là ai',
            singer: 'Huỳnh Công Hiếu, DT tập rap & Umie',
            path: 'assets/music/Anh-Là-Ai-Huỳnh-Công-Hiếu-_-DT-Tập-Rap-Team-B-Ray-Rap-Việt-2023-_MV-Lyrics_.mp3',
            image:'assets/img/anh_la_ai.jpg'
        },
        {
            name: 'Bí mật nhỏ',
            singer: 'Bray x Bảo Hân Helia x Hoàng Tôn',
            path: 'assets/music/B-Ray-x-Bảo-Hân-Helia-x-Hoàng-Tôn-BÍ-MẬT-NHỎ-Official-M-V.mp3',
            image:'assets/img/bi_mat_nho.jpg'
        },
        {
            name: 'Id 072019',
            singer: '3107 ft 267',
            path: 'assets/music/id-072019.mp3',
            image:'assets/img/id-072019.jpg'
        },
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng M-tp',
            path: 'assets/music/NƠI-NÀY-CÓ-ANH-OFFICIAL-MUSIC-VIDEO-SƠN-TÙNG-M-TP.mp3',
            image:'assets/img/noi-nay-co-anh.jpg'
        },
        {
            name: 'Rolling Down',
            singer: 'Captain',
            path: 'assets/music/Rolling-Down-CAPTAIN-Team-B-Ray-Rap-Việt-2023-_MV-Lyrics_.mp3',
            image:'assets/img/rowlingDown.jpg'
        },
        {
            name: 'Making My Way',
            singer: 'Sơn Tùng M-tp',
            path: 'assets/music/SON-TUNG-M-TP-MAKING-MY-WAY-OFFICIAL-VISUALIZER.mp3',
            image:'assets/img/making my way.jpg'
        },
        {
            name: 'Sống cho hết đời thanh xuân 4',
            singer: 'Huỳnh Công Hiếu x Ngắn',
            path: 'assets/music/Sống-Cho-Hết-Đời-Thanh-Xuân-4-Huỳnh-Công-Hiếu-Team-B-Ray-Rap-Việt-2023-_MV-Lyrics_.mp3',
            image:'assets/img/song-cho-het-doi-TX.jpg'
        },
        {
            name: 'Trước khi em tồn tại(cover)',
            singer: 'Thắng Việt Anh',
            path: 'assets/music/Trước-Khi-Em-Tồn-Tại-_Piano-Version_-Thắng-Việt-Anh-Cover-_MV-Lyric_.mp3',
            image:'assets/img/truoc-khi-em-ton-tai.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index)=>{
            return `<div class="song ${index == this.currentIndex ? 'active' : ''}" data-index=${index}>
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        });
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvent: function(){
        //Xử lý phóng to thu nhỏ cd
        const cdWidth = cd.offsetWidth;
        const _this = this;
        document.onscroll = function(){
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newCbWidth = cdWidth - scrollTop;

            cd.style.width = newCbWidth > 0 ? newCbWidth + 'px' : 0;
            cd.style.opacity = newCbWidth  / cdWidth;
        }
        //xử lý cd quay
        const animateCdThumb = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ],
            {
                duration: 10000,
                iterations: Infinity
            }
        );

        animateCdThumb.pause();

        //xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }
        //khi song được play
        audio.onplay = function(){
            player.classList.add('playing');
            _this.isPlaying = true;
            animateCdThumb.play();
        };
        //Khi song được pause
        audio.onpause = function(){
            player.classList.remove('playing');
            _this.isPlaying = false;
            animateCdThumb.pause();
        };
        
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if (!_this.isSeeking) {
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }
        };

        // Xử lý khi bắt đầu kéo thanh tua
        progress.addEventListener('input', function(e) {
            _this.isSeeking = true;
        });

        // Xử lý khi kết thúc kéo thanh tua
        progress.addEventListener('change', function(e) {
            const seekTime = audio.duration * (e.target.value / 100);
            audio.currentTime = seekTime;
            _this.isSeeking = false;
        });

        //Xử lý chuyển bài khi click next
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToSong();
        };

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToSong();
        };
        
        //xử lý random song ngẫu nhiên
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        
        //Phát chỉ một bài
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Tự động next khi hết bài
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        };

        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                if(e.target.closest('.option')){

                }
            }
        };

    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },200);
    },

    start: function(){
        //Gán cầu hình từ config
        this.loadConfig();
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //Lắng nghe xử lý sự kiện DOM event
        this.handleEvent();
        //Tải thông tin bài hát đầu tiên vào ui khi chạy ứng dụng
        this.loadCurrentSong();
        //render playlist
        this.render();


        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start();

