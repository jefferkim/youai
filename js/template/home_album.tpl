<div class="hd">
    <span class="icon"><em></em></span>
    <h3><b>专辑</b><em><%= home_albumTitle %></em></h3>
</div>
<div class="bd">
    <div class="block">
        <%= firstAlbumOperators %>
    </div>
    <div class="block">
        <ul class="albums">

        <% _.each(albums, function(album,index) { %>
            <li <% if(index % 2 != 0){%> class="even"  <%}%>>
                <a href="#"><img src="<%= album.isvInfo.brandImage %>"/>
                   <span><%= album.title %></span>
                </a>
            </li>
         <% }); %>

        </ul>
    </div>
</div>