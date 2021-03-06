import Page from '../js/page'
import Filter from '../js/xbmcFilter'

export default (new Page({
	'id': 'TV Shows',
	'view': 'list',
	'groupby': 'title',
	'icon': state => 
			state['group'] === 'actor' || state['actor'] ? 'img/icons/default/DefaultActor.png' :
			state['group'] === 'year' || state['year'] ? 'img/icons/default/DefaultYear.png' :
			state['group'] === 'genre' || state['genre'] ? 'img/icons/default/DefaultGenre.png' :
			'img/icons/default/DefaultTVShows.png',
	'parentState': state => ({ 'page': 'Menu', 'media': 'TV Shows' }),
	'data': function (state) {

		//http://kodi.wiki/view/JSON-RPC_API/v6#List.Filter.Fields.TVShows
		const fields = [
			{ name: 'Title', key: 'title', type: 'string' },
			{ name: 'Genre', key: 'genre', type: 'string' },
			{ name: 'Genre', key: 'genreid', type: 'integer' },
			{ name: 'Year', key: 'year', type: 'integer' },
			{ name: 'Actor', key: 'actor', type: 'string' },
			{ name: 'Studio', key: 'studio', type: 'string' },
			{ name: 'Tag', key: 'tag', type: 'string' }
		]
		const filter = Filter.fromState(state, fields)

		let group = state['group'] || this.groupby

		return xbmc.get({
			method: 'VideoLibrary.GetTVShows',
			params: {
				'properties': [ 'title', 'originaltitle', 'sorttitle', 'thumbnail', 'episode' ],
				'filter': filter.out()
			},
			cache: true
		})
		.then(result => result.tvshows || [])
		.then(tvshows => tvshows.map(tvshow => ({ //format items
			label: tvshow.title + (tvshow.originaltitle && tvshow.originaltitle != tvshow.title ? ' ['+tvshow.originaltitle+']' : ''),
			details: [ tvshow.episode + ' episodes' ],
			link: '#page=TV Show&tvshowid=' + tvshow.tvshowid,
			thumbnail: tvshow.thumbnail ? xbmc.vfs2uri(tvshow.thumbnail) : 'img/icons/default/DefaultVideo.png',
			title: (tvshow.sorttitle || tvshow.title || tvshow.originaltitle)[0].toUpperCase()
		})))
		.then(items => ({
			title: 'TV Shows' + (group ? ' by '+group : ''),
			subtitle: filter.toString(),
			items: items
		}))

	}
}));