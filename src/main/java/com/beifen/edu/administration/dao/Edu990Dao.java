package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu990;

public interface Edu990Dao extends JpaRepository<Edu990, Long>,JpaSpecificationExecutor<Edu990> {

	//查询用户是否存在
	@Query(value = "select * from edu990 b where b.yhm=?1", nativeQuery = true)
	public String checkIsHaveUser(String userName);
	
	//查询密码是否正确
	@Query(value = "select b.mm from edu990 b where b.yhm=?1", nativeQuery = true)
	public String checkPwd(String userName);
	
	//根据用户名查询用户信息
	@Query(value = "select * from edu990 b where b.yhm=?1", nativeQuery = true)
	public Edu990 getUserInfo(String userName);

	
	// 修改教学班名称
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu990 SET yxkjfs =?2 WHERE BF990_ID =?1", nativeQuery = true)
	public void newShortcut(String userId, String newShortcut);

	
	//检查有没有系统用户
	@Query(value = "select * from edu990 b where b.js=?1", nativeQuery = true)
	public Edu990 checkHaveSysUser(String sysUse);
	
	//删除角色
	@Transactional
	@Modifying
	@Query(value = "delete from edu990 where Bf990_ID =?1", nativeQuery = true)
	public void removeUser(String bf990_ID);

	
	//删除角色时查看角色当前是否有人使用
	@Query(value = "select * from edu990 b where b.js=?1", nativeQuery = true)
	public List<Edu990> useThisRoleEdu990s(String js);
}
