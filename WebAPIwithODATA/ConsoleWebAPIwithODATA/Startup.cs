using System.Web.Http;

using ConsoleWebAPIwithODATA;

using Microsoft.Owin;
using Microsoft.Owin.Hosting;

using Owin;

[assembly: OwinStartup(typeof(Startup))]

namespace ConsoleWebAPIwithODATA
{
	public class Startup
	{
		// This code configures Web API. The Startup class is specified as a type
		// parameter in the WebApp.Start method.
		public void Configuration(IAppBuilder appBuilder)
		{
			// Configure Web API for self-host. 
			var config = new HttpConfiguration();
			config.MapHttpAttributeRoutes();
			appBuilder.UseWebApi(config);
		} 
	}
}
