using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(WebAPIwithODATA.Startup))]

namespace WebAPIwithODATA
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			//TODO update nuget packages
		}
	}
}
