<script lang="ts">



</script>



<div class="info-box">
    <div class="left">
        <img src="/icons/HyvaTietaa.svg" />
        <p>Hyvä<br> tietää</p>
    </div>
    <div class="right">
        <slot />
    </div>
        
</div>


<style >
    :global {
        .info-box {
            background-color: var(--accent-main);
    
            padding: 10px;
    
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
    
            border-radius: 7px;
    
            max-width: 250px;
            width: 90%;
    
            margin: 10px;
        }
    
        .info-box .left {
            width: 75px;
    
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    
        .info-box .left p {
            text-align: center;
            font-family: 'bold';
            color: white;
    
            font-size: .9rem;
        }
    
        .info-box .left img {
            width: 35px;
            height: 35px;
    
            margin-bottom: 5px;
        }
    
        .info-box .right {
            width: calc(100% - 85px);
    
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            border-left: solid 1px white;
            padding-left: 10px;
        }
    
        .info-box .right p {
            font-size: .8rem;
            margin: 0;
    
            color: white;
        }

        .info-box .right li {
            margin-left: 5px;
            list-style: none;
        }
    }
</style>