/**
 * @author jundeng
 * @version 2015年12月3日2015ApiUrlManager.java
 *
 */
package com.alipay.sts.biz.apiurl;

import com.alipay.sts.biz.base.IBaseManager;
import com.alipay.sts.common.dao.model.api.ApiUrlDO;
import com.alipay.sts.core.model.api.ApiUrl;

import java.util.List;

public interface ApiUrlManager extends IBaseManager<ApiUrl, ApiUrlDO> {
	/**
	 * 根据url查询
	 * @param url
	 * @return
	 */
	List<ApiUrl> findByUrl(String url);
	/**
	 * 根据appName查询
	 * @param appName
	 * @return
	 */
	List<ApiUrl> findByAppName(String appName);
	/**
	 * 根据url和系统名称查询
	 * @param url
	 * @param appName
	 * @return
	 */
	List<ApiUrl> findByUrlAndAppName(String url,String appName);

	/**
	 * 根据repoPath fullClassName methodName 去查询url对象 Sofa的 返回是一个List
	 */
	List<ApiUrl> findSofaApiUrlByRepoPathFullClassMethodName(String repoPath,String fullClassName,String methodName);

	/**
	 * 根据repoPath fullClassName methodName url 去查询url对象 Sofa的 返回是一个List
	 */
	List<ApiUrl> findSofaApiUrlByRepoPathFullClassMethodNameUrl(String repoPath,String fullClassName,String methodName,String url);


	List<ApiUrl> findActiveApiUrlByMethodSignature(String methodSignature);

	List<ApiUrl> findActiveApiUrlByRepoUrl(String repoPath, String url);
}
